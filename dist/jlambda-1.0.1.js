var $l = {};
//$l.start = function () {
    var fna = Array.prototype;
    LambdaType = { WHERE: 1, SELECT: 2, DISTINCT: 3, FIRST: 4, LAST: 5, COUNT: 6, ANY: 7, EACH: 8, AGGREGATE: 9, SUM: 10, MIN: 11, MAX: 12, AVG: 13 };
    Lambda = function (arrSelf, lambdaType, expression) {

        expression = expression || function (x) { return x; };

        var func = expression;

        if (typeof expression != 'function') {
            var strAllExpression = expression;

            if (typeof expression != 'string')
                strAllExpression = expression.toString().substring(1, expression.toString().length - 1);

            var indexVar = strAllExpression.indexOf('=>');
            var strParameters = strAllExpression.substring(0, indexVar);
            var strExpression = strAllExpression.substring(indexVar + 2, strAllExpression.length);

            eval('func = function(' + strParameters + '){ ' + (lambdaType == LambdaType.EACH ? '' : 'return ') + strExpression + ';}');

        }

        var arr = [];

        switch (lambdaType) {
            case LambdaType.WHERE:
                for (var i = 0; i < arrSelf.length; i++)
                    func(arrSelf[i], i, arrSelf) && arr.push(arrSelf[i]);
                break;
            case LambdaType.SELECT:
                for (var i = 0; i < arrSelf.length; i++)
                    arr.push(func(arrSelf[i], i, arrSelf));
                break;
            case LambdaType.DISTINCT:
                var arrTemp = [];
                for (var i = 0; i < arrSelf.length; i++) {
                    var result = func(arrSelf[i], i, arrSelf);
                    if (!arrTemp.Contains(result))
                        arr.push(arrSelf[i]);
                    arrTemp.push(result);
                }
                break;
            case LambdaType.FIRST:
                for (var i = 0; i < arrSelf.length; i++)
                    if (func(arrSelf[i], i, arrSelf))
                        return arrSelf[i];
                return null;
                break;
            case LambdaType.LAST:
                for (var i = arrSelf.length - 1; i > -1; i--)
                    if (func(arrSelf[i], i, arrSelf))
                        return arrSelf[i];
                return null;
                break;
            case LambdaType.COUNT:
                var count = 0;
                for (var i = 0; i < arrSelf.length; i++)
                    func(arrSelf[i], i, arrSelf) && count++;
                return count;
                break;
            case LambdaType.ANY:
                for (var i = 0; i < arrSelf.length; i++)
                    if (func(arrSelf[i], i, arrSelf)) return true;
                return false;
                break
            case LambdaType.EACH:
                for (var i = 0; i < arrSelf.length; i++)
                    func(arrSelf[i], i, arrSelf);
                return;
                break;
            case LambdaType.AGGREGATE:
                var agreggate = null;
                for (var i = 0; i < arrSelf.length; i++)
                    agreggate = func(agreggate, arrSelf[i], i, arrSelf);
                return agreggate;
                break;
            case LambdaType.SUM:
                var sum;
                for (var i = 0; i < arrSelf.length; i++) {
                    var r = func(arrSelf[i], i, arrSelf);
                    if (sum) sum += r;
                    else sum = r;
                }
                return sum;
                break;
            case LambdaType.MIN:
                var min;
                var obj;
                for (var i = 0; i < arrSelf.length; i++) {
                    var r = func(arrSelf[i], i, arrSelf);
                    if (!min || r < min) { min = r; obj = arrSelf[i]; }
                }
                return obj;//min;
                break;
            case LambdaType.MAX:
                var max;
                var obj;
                for (var i = 0; i < arrSelf.length; i++) {
                    var r = func(arrSelf[i], i, arrSelf);
                    if (!max || r > max) { max = r; obj = arrSelf[i]; }
                }
                return obj;//max;
                break;
            case LambdaType.AVG:
                return arrSelf.Sum(func) / arrSelf.length;
                break;
            default:
                break;
        }
        return arr;
    };

    fna.Where = function (expression) {
        return Lambda(this, LambdaType.WHERE, expression);
    };
    fna.Select = function (expression) {
        return Lambda(this, LambdaType.SELECT, expression);
    };
    fna.Distinct = function (expression) {
        return Lambda(this, LambdaType.DISTINCT, expression);
    };
    fna.Single = fna.Find = fna.First = function (expression) {
        return Lambda(this, LambdaType.FIRST, expression);
    };
    fna.Last = function (expression) {
        return Lambda(this, LambdaType.LAST, expression);
    };
    fna.Count = function (expression) {
        if (!expression) return this.length;
        return Lambda(this, LambdaType.COUNT, expression);
    };
    fna.Any = function (expression) {
        if (!expression) return this.length > 0;
        return Lambda(this, LambdaType.ANY, expression);
    };
    fna.None = function (expression) {
        return !this.Any(expression);
    };
    fna.Each = function (expression) {
        Lambda(this, LambdaType.EACH, expression);
    };
    fna.Aggregate = function (expression) {
        return Lambda(this, LambdaType.AGGREGATE, expression);
    };
    fna.Sum = function (expression) {
        return Lambda(this, LambdaType.SUM, expression);
    };
    fna.Min = function (expression) {
        return Lambda(this, LambdaType.MIN, expression);
    };
    fna.Max = function (expression) {
        return Lambda(this, LambdaType.MAX, expression);
    };
    fna.Average = function (expression) {
        return Lambda(this, LambdaType.AVG, expression);
    };

    fna.IndexOf = function (element) {
        for (var i = 0; i < this.length; i++)
            if ($l.Equals(this[i], element)) return i;
        return -1;
    };
    fna.Contains = function (element) {
        return this.IndexOf(element) > -1;
    };
    fna.Reverse = function () {
        var arr = [];
        for (var i = this.length - 1; i > -1; i--)
            arr.push(this[i]);
        return arr;
    };

    //var fno = Object.prototype;

    $l.Equals = function (self, element) {
        return JSON.stringify(self) === JSON.stringify(element);
    };
    $l.Different = function (element) {
        return !$l.Equals(self, element);
    };

    var fns = String.prototype;
    fns.ToArray = function () {
        return this.split('');
    };
    fns.Equals = function (element) {
        return this.toString() === element;
    };
//};
//OrderBy OrderByDesc GroupBy Sum Max Min
/***??????????????????????---JSON.stringify -- JSON2 - IE8 OR jQUERY*/