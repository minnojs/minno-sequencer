import './databaseModule';

var randomizer;

describe('database query',function(){

    var result;
    var coll = [
        {set:1, data:{val:1, other:'value'}},
        {set:1, data:{val:2}},
        {set:2, data:{val:3}},
        {set:2, data:{val:4, handle:'innerHandle'}, handle:'outerHandle'}
    ];
    var q;

    beforeEach(module('database'));
    beforeEach(module(function(){
        randomizer = jasmine.createSpyObj('randomizer', ['random','exRandom','sequential']);
        randomizer.random.and.returnValue(1);
        randomizer.exRandom.and.returnValue(1);
        randomizer.sequential.and.returnValue(1);
    }));

    beforeEach(inject(function(databaseQuery){
        q = function(){result = databaseQuery.apply(null, [arguments[0], coll, randomizer]);};
    }));

    it('should support returning a random document', function(){
        q({});
        expect(result).toBe(coll[1]);
    });

    it('should support returning a random document by set', function(){
        q({set:2});
        expect(result).toBe(coll[3]);
    });

    it('should randomly pick from the appropriate set if the query is a string', function(){
        q(2);
        expect(result).toBe(coll[3]);
    });

    it('should support querying by data:Obj', function(){
        // the query only returns one row, we should reset the randomizer accordingly
        randomizer.random.and.returnValue(0);

        q({data:{val:1}});
        expect(result).toBe(coll[0]);

        q({data:{val:3}});
        expect(result).toBe(coll[2]);
    });

    it('should support querying by a data:Function', function(){
        // the query only returns one row, we should reset the randomizer accordingly
        randomizer.random.and.returnValue(0);

        q({data:function(value){return value.data.val === 3;}});
        expect(result).toBe(coll[2]);
    });

    it('should support querying by a data:String (handle - on object)', function(){
        // the query only returns one row, we should reset the randomizer accordingly
        randomizer.random.and.returnValue(0);

        q({data:'outerHandle'});
        expect(result).toBe(coll[3]);
    });

    it('should support querying by a data:String (handle - in data)', function(){
        // the query only returns one row, we should reset the randomizer accordingly
        randomizer.random.and.returnValue(0);

        q({data:'innerHandle'});
        expect(result).toBe(coll[3]);
    });

    it('should throw an error if an object was not found', function(){
        expect(function(){
            q({set:18});
        }).toThrow();
    });

    describe(': type randomization', function(){

        it('should allow using a custom function as a query', function(){
            var compare = {};
            var fn = jasmine.createSpy('dummy').and.returnValue(compare);
            q(fn);
            expect(result).toEqual(compare);
            expect(fn).toHaveBeenCalledWith(coll);
        });

        it('should support exRandom', function(){
            q({type:'exRandom'});
            expect(randomizer.exRandom).toHaveBeenCalled();
        });

        it('should support equalDistribution', function(){
            var n = coll.length*2;

            expect(function(){
                q({type:'equalDistribution', n:n});
            }).toThrow();
            q({type:'equalDistribution', n:n, seed:'seed'});
            expect(randomizer.exRandom).toHaveBeenCalledWith(n, jasmine.any(String), undefined);

            q({type:'at', n:n, at:7});
            expect(result).toBe(coll[2]);
        });

        it('should support sequential access', function(){
            q({type:'sequential'});
            expect(randomizer.sequential).toHaveBeenCalled();
        });

        it('should support first and last', function(){
            q({type:'first'});
            expect(result).toBe(coll[0]);
            q({type:'last'});
            expect(result).toBe(coll[3]);
        });

        it('should support at', function(){
            q({type:'at', at: 2});
            expect(result).toBe(coll[1]);
        });
    });
});
