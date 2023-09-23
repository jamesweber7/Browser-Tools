
document.addEventListener('DOMContentLoaded', () => {
    Calculator.setup();
})

class Calculator extends StaticComponent {
    static documentElementId = 'calculator';
    static buttonId = 'calculator-execute-btn';
    // Integration loses accuracy when lower/upper bounds are any larger
    static IntegrationInfinity = 2 ** 14;
    static HALF_SAFE_INTEGER = Math.floor(Number.MAX_SAFE_INTEGER * 0.5);
    static ACCURATE_DX = 2 ** -24;
    static STANDARD_INTEGRATION_STEPS = 2 ** 20;
    static standardNormalDistributions = [
        {
            z: -8,
            area: 0.00000000000000062209605
        },
        {
            z: -5,
            area: 0.00000028665157187919391
        },
        {
            z: -4,
            area: 0.00003167124183311992125
        },
        {
            z: -3,
            area: 0.00134989803163009452665
        },
        {
            z: -2,
            area: 0.02275013194817920720028
        },
        {
            z: -1,
            area: 0.1586552539314570514148
        },
        {
            z: -0.5,
            area: 0.3085375387259868963623
        },
        {
            z: -0.1,
            area: 0.4601721627229710185346
        },
        {
            z: 0,
            area: 0.5
        }
    ]

    static calculatorInput = document.getElementById('calculator-input');
    static calculatorOutput = document.getElementById('calculator-output');

    static setupDocumentElement() {

        this.button().onclick = () => {
            this.calculate();
        };

    }

    static parseEquation(equation, onerror = throwErr, variables = []) {
        equation = equation.trim();
        equation = equation.replaceAll('^', '**');
        equation = this.giveOutsideParentheses(equation);
        equation = this.giveHeaders(equation);
        return equation;
    }

    static giveHeaders(equation) {
        return equation;
    }

    static giveOutsideParentheses(equation) {
        while (equation.includes(')') && (equation.indexOf(')') < equation.indexOf('(') || !equation.includes('(') || equation.split(')').length > equation.split('(').length)) {
            equation = '(' + equation;
        }
        while (equation.includes('(') && (equation.lastIndexOf('(') > equation.lastIndexOf(')') || !equation.includes(')') || equation.split('(').length > equation.split(')').length)) {
            equation = equation + ')';
        }
        return equation;
    }

    static throwErr(error) {
        throw error;
    }

    // def haven't done much at all yet
    static calculateNew() {
        let solution = this.parseEquation(this.calculatorInput.value, this.displayInvalid);
        this.displaySolution(solution);
    }

    static calculate() {
        let equation = this.calculatorInput.value;
        if (!equation) {
            return this.displaySolution('aha i think u forgot to write somethin aha');
        }
        // if special command, execute & return if necessary
        if (this.executeSpecialCommand(equation)) {
            return;
        }

        equation = this.replaceCalculatorFunctions(equation);

        // exponents
        equation = equation.replaceAll('^', '**');
        // trig
        equation = equation.replaceAll('sin(', 'Math.sin(');
        equation = equation.replaceAll('cos(', 'Math.cos(');
        equation = equation.replaceAll('tan(', 'Math.tan(');
        equation = equation.replaceAll('pi', 'Math.PI');

        // uneven parenthesis
        while (equation.includes(')') && (equation.indexOf(')') < equation.indexOf('(') || !equation.includes('(') || equation.split(')').length > equation.split('(').length)) {
            equation = '(' + equation;
        }
        while (equation.includes('(') && (equation.lastIndexOf('(') > equation.lastIndexOf(')') || !equation.includes(')') || equation.split('(').length > equation.split(')').length)) {
            equation = equation + ')';
        }

        try {
            this.displaySolution(eval(equation));
        } catch (e) {
            console.error(equation);
            console.error(e);
            this.displayInvalid();
        }
    }

    static displaySolution(text) {
        this.calculatorOutput.innerText = text
    }

    static displayInvalid() {
        let err = document.createElement('err');
        err.innerText = 'NaN';
        this.calculatorOutput.innerText = '';
        this.calculatorOutput.append(err);
    }

    static executeSpecialCommand(equation) {
        if (equation.includes('list') || equation.includes('-l')) {
            equation = equation.replaceAll('-list', '');
            equation = equation.replaceAll('-l', '');
            equation = equation.replaceAll('list', '');
            this.listFunction(equation);
            return true;
        }
    }

    static listFunction(functionText) {
        if (functionText.includes('*')) {
            this.displaySolution(
` - binomialpmf
 - binomialcmf
 - poissonpmf
 - poissoncmf
 - p
 - mean
 - variance
 - deviation
 - sum
 - derivative
 - integral
 - continuousMean
 - continuousVariance
 - continuousDeviation
 - continuouscdf
 - continuousUniformpdf
 - continuousUniformcdf
 - continuousUniformMean
 - continuousUniformVariance
 - continuousUniformDeviation
 - normalpdf
 - normalcdf
 - standardizeNormal
 - exponentialpdf
 - exponentialcdf
 - exponentialDeviation
 - exponentialVariance
 - exponentialDeviation
 - IInf`
            );
        }
        if (functionText.includes('binomialpmf')) {
            this.displaySolution(
                `binomial probability mass function :
𝑷(𝑿=x) = ₙ𝑪ₓ∙pˣ∙(1-p)⁽¹⁻ˣ⁾ 
params: n=# of trials, p=𝑷(𝑿=x), x`
            );
            return;
        }
        if (functionText.includes('binomialcmf')) {
            this.displaySolution(
                `binomial cumulative mass function :
𝑓(x) = 𝑷(𝑿≤x) = ∀𝑿≤x Σ ₙ𝑪ₓ∙pˣ∙(1-p)⁽¹⁻ˣ⁾ 
params: n=# of trials, p=𝑷(𝑿=x), x`
            );
            return;
        }
        if (functionText.includes('poissonpmf')) {
            this.displaySolution(
                `poisson probability mass function :
𝑷(𝑿=x) = ( (λ∙𝑻)ˣ∙e⁻⁽λ*𝑻⁾ ) /x!
params: λ=rate, x, T=units
OR params: λ*T, x`
            );
            return;
        }
        if (functionText.includes('poissoncmf')) {
            this.displaySolution(
                `poisson cumulative mass function :
𝑓(x) = 𝑷(𝑿≤x) = ∀𝑿≤x Σ ( (λ∙𝑻)ˣ∙e⁻⁽λ*𝑻⁾ ) /x!
params: λ=rate, x, 𝑻=units
OR params: λ*𝑻, x`
            );
            return;
        }
        if (functionText.includes('prob')) {
            this.displaySolution(
                `create probability :
params: x, p(x)`
            );
            return;
        }
        if (functionText.includes('mean')) {
            this.displaySolution(
                `discrete mean function :
μ = 𝑬(𝑿) = ∀ₓΣ x∙p(x)
params: [] probabilities`
            );
            return;
        }
        if (functionText.includes('variance')) {
            this.displaySolution(
                `discrete variance function :
𝑽(x) = σ² = 𝑬(𝑿²) - μ = 𝑬(𝑿²) - 𝑬(𝑿)
𝑽(x) = ∀ₓΣ x²∙p(x) - ∀ₓΣ x∙p(x) = ∀ₓΣ (x²-x)∙p(x)
params: [] probabilities`
            );
            return;
        }
        if (functionText.includes('deviation')) {
            this.displaySolution(
                `standard deviation :
             ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
σ = 𝑽(x)² = ⎷ ∀ₓΣ (x²-x)∙p(x)
params: n=# of trials, p(x)=𝑷(𝑿=x), x`
            );
            return;
        }
        if (functionText.includes('sum')) {
            this.displaySolution(
                `sum:
    end
    ⎲
    ⎳ 𝒇(x)
  i=start
params: start, end, 𝒇(x)`
            );
            return;
        }
        if (functionText.includes('derivative')) {
            this.displaySolution(
                `derivative:
𝑑𝑦/𝑑𝑥 = ( 𝑓(x + 𝑑𝑥) - 𝑓(x) ) / 𝑑𝑥
not exact: using 𝑑𝑥=2⁻²⁴
params: 𝑓(x), x`
            );
            return;
        }
        if (functionText.includes('integral')) {
            this.displaySolution(
                `integral:
            b
⌠          ⎲
⌡𝑓(𝑥)𝑑𝑥 =  ⎳ 𝒇(x)𝑑𝑥
            a
not exact: using 𝑑𝑥=2⁻²⁴
params: 𝑓(x), a, b`
            );
            return;
        }
        if (functionText.includes('continuousMean')) {
            this.displaySolution(
                `continuous mean:
⌠ᵇ  
⌡ₐ x * f(x)𝑑𝑥
params: 𝑓(x), a, b`
            );
            return;
        }
        if (functionText.includes('continuousVariance')) {
            this.displaySolution(
                `continuous variance:

⌠ᵇ               ⎧⌠ᵇ           ⎫²
⌡ₐ x² * f(x)𝑑𝑥 - ⎩⌡ₐ x * f(x)𝑑𝑥⎭
E(X²) - μ²
params: 𝑓(x), a, b`
            );
            return;
        }
        if (functionText.includes('continuousDeviation')) {
            this.displaySolution(
                `continuous deviation:
σ = √V(x)
params: 𝑓(x), a, b`
            );
            return;
        }
        if (functionText.includes('continuouscdf')) {
            this.displaySolution(
                `continuous cumulative density function:
⌠ᵇ
⌡ₐ f(x)𝑑𝑥
params: 𝑓(x), a, b`
            );
            return;
        }
        if (functionText.includes('continuousUniformpdf')) {
            this.displaySolution(
                `continuous uniform probability density function:
∀c₁,c₂∈ X ∈ [a, b] (f(c₁) = f(c₂))
f(x) = 1 / (b - a)
params: a, b`
            );
            return;
        }
        if (functionText.includes('continuousUniformcdf')) {
            this.displaySolution(
                `continuous uniform cumulative density function:
⌠ˣ   
⌡ₐ f(x)𝑑𝑥
   ⌠ˣ  __1__
 = ⌡ₐ  b - a 𝑑𝑥
    __x__  ⎢ˣ 
 =  b - a  ⎢ₐ 
 = (x-a) / (b-a)
params: x, a, b`
            );
            return;
        }
        if (functionText.includes('continuousUniformMean')) {
            this.displaySolution(
                `continuous uniform mean:
⌠ᵇ  
⌡ₐ x * f(x)𝑑𝑥
   ⌠ᵇ __x__
 = ⌡ₐ b - a 𝑑𝑥
    __x²___  ⎢ᵇ  
 =  2(b-a)   ⎢ₐ
   _b²_-_a²_
 =  2(b-a)   
 = (b + a) / 2
params: a, b`
            );
            return;
        }
        if (functionText.includes('continuousUniformVariance')) {
            this.displaySolution(
                `continuous uniform variance:
⌠ᵇ               ⎧⌠ᵇ           ⎫²
⌡ₐ x² * f(x)𝑑𝑥 - ⎩⌡ₐ x * f(x)𝑑𝑥⎭
 = (b - a)² / 12
params: a, b`
            );
            return;
        }
        if (functionText.includes('continuousUniformDeviation')) {
            this.displaySolution(
                `continuous uniform deviation:
σ = √V(x)      __
  = (b - a) / √12
params: a, b`
            );
            return;
        }
        if (functionText.includes('normalpdf')) {
            this.displaySolution(
                `normal probability density function:
        (-(x-μ)² / (2σ²))
N(μ, σ²) = e^ / √2πσ
params: x, μ, σ`
            );
            return;
        }
        if (functionText.includes('normalcdf')) {
            this.displaySolution(
                `normal cumulative density function:
⌠ᵇ  
⌡ₐ N(μ, σ²)𝑑𝑥
params: a, b, μ, σ`
            );
            return;
        }
        if (functionText.includes('standardizeNormal')) {
            this.displaySolution(
                `standardizing a normal random variable:
Z = (x - μ) / σ
params: X, μ, σ`
            );
            return;
        }
        if (functionText.includes('exponentialpdf')) {
            this.displaySolution(
                `exponential probability mass function:
            -λx
f(x) = λ * e^
params: λ, x`
            );
            return;
        }
        if (functionText.includes('exponentialcdf')) {
            this.displaySolution(
                `exponential cumulative mass function:
            -λx
F(x) = 1 - e^
params: λ, x`
            );
            return;
        }
        if (functionText.includes('exponentialDeviation')) {
            this.displaySolution(
                `exponential mean:
μ = 1 / λ
params: λ`
            );
        }
        if (functionText.includes('exponentialVariance')) {
            this.displaySolution(
                `exponential variance:
V(x) = 1 / λ²
params: λ`
            );
            return;
        }
        if (functionText.includes('exponentialDeviation')) {
            this.displaySolution(
                `exponential deviation:
σ = 1 / λ
params: λ`
            );
            return;
        }
        if (functionText.includes('IInf')) {
            this.displaySolution(
                `Constant: Integration Infinity:
∞ = 2¹⁴
just gives more accurate integrals`
            );
            return;
        }

    }   // end list functions

    static replaceCalculatorFunctions(equation) {
        equation = replaceCalculatorFunction(equation, 'IInf', 'IntegrationInfinity');
        equation = replaceCalculatorFunction(equation, 'binomialpmf(');
        equation = replaceCalculatorFunction(equation, 'binomialcmf(');
        equation = replaceCalculatorFunction(equation, 'poissonpmf(');
        equation = replaceCalculatorFunction(equation, 'poissoncmf(');
        equation = replaceCalculatorFunction(equation, 'prob(', 'createProbability(');
        equation = replaceCalculatorFunction(equation, 'discreteMean(');
        equation = replaceCalculatorFunction(equation, 'discreteVariance(');
        equation = replaceCalculatorFunction(equation, 'discreteDeviation(');
        equation = replaceCalculatorFunction(equation, 'sum(');
        equation = replaceCalculatorFunction(equation, 'derivative(');
        equation = replaceCalculatorFunction(equation, 'integral(');
        equation = replaceCalculatorFunction(equation, 'midpointRiemann(');
        equation = replaceCalculatorFunction(equation, 'leftRiemann(');
        equation = replaceCalculatorFunction(equation, 'continuousMean(');
        equation = replaceCalculatorFunction(equation, 'continuousVariance(');
        equation = replaceCalculatorFunction(equation, 'continuousDeviation(');
        equation = replaceCalculatorFunction(equation, 'continuouscdf(');
        equation = replaceCalculatorFunction(equation, 'normalpdf(');
        equation = replaceCalculatorFunction(equation, 'normalcdf(');
        equation = replaceCalculatorFunction(equation, 'continuousUniformpdf(');
        equation = replaceCalculatorFunction(equation, 'continuousUniformcdf(');
        equation = replaceCalculatorFunction(equation, 'continuousUniformMean(');
        equation = replaceCalculatorFunction(equation, 'continuousUniformVariance(');
        equation = replaceCalculatorFunction(equation, 'continuousUniformDeviation(');
        equation = replaceCalculatorFunction(equation, 'standardNormalpdf(');
        equation = replaceCalculatorFunction(equation, 'standardNormalcdf(');
        equation = replaceCalculatorFunction(equation, 'standardizeNormal(');
        equation = replaceCalculatorFunction(equation, 'inverseNormal(');
        equation = replaceCalculatorFunction(equation, 'inverseStandardNormal(');
        equation = replaceCalculatorFunction(equation, 'exponentialpdf(');
        equation = replaceCalculatorFunction(equation, 'exponentialcdf(');
        equation = replaceCalculatorFunction(equation, 'exponentialMean(');
        equation = replaceCalculatorFunction(equation, 'exponentialVariance(');
        equation = replaceCalculatorFunction(equation, 'exponentialDeviation(');

        return equation;

        function replaceCalculatorFunction(equation, func, newFunc) {
            if (newFunc) {
                return equation.replaceAll(func, `Calculator.${newFunc}`);
            }
            return equation.replaceAll(func, `Calculator.${func}`);
        }
    }   // end replace calculator functions

    static sum(start, end, func, step = 1) {
        return this.loopSum(start, end, func, step = 1);
    }

    // ⎲
    // ⎳ Sigma Sum with recursion
    static recursiveSum(start, end, func, step = 1) {
        if (start > end) {
            return 0;
        }
        return func(start) + this.sum(start + step, end, func, step);
    }

    // ⎲
    // ⎳ Sigma Sum with for loop (to prevent SO)
    static loopSum(start, end, func, step = 1) {
        let sum = 0;
        for (let i = start; i <= end; i += step) {
            sum += func(i);
        }
        return sum;
    }


    /*=============================================
    =                   Calculus                  =
    =============================================*/

    static derivative(funct, x, dx=this.ACCURATE_DX) {
        let x2 = x + dx;

        let y = funct(x);
        let y2 = funct(x2);

        let dy = y2 - y;
        return dy / dx;
    }

    static integral(funct, a, b, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        if (this.isImproperIntegral(a, b)) {
            return this.improperIntegral(funct, a, b, steps, minDx);
        }
        let dx = this.getIntegrationDx(a, b, steps, minDx);
        return this.midpointRiemann(funct, a, b, dx);
    }

    static trapeziumIntegral(funct, a, b, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        let dx = this.getIntegrationDx(a, b, steps, minDx);
        return this.trapeziumApproximation(funct, a, b, dx);
    }

    static midpointIntegral(funct, a, b, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        let dx = this.getIntegrationDx(a, b, steps, minDx);
        return this.midpointRiemann(funct, a, b, dx);
    }

    static getIntegrationDx(a, b, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        let dx = (b - a) / steps;
        return Math.max(dx, minDx);
    }

    static getSteps(a, b, proportion=1, minDx=this.ACCURATE_DX) {
        const range = b - a;
        let steps = this.STANDARD_INTEGRATION_STEPS / proportion;
        steps = Math.min(steps, range / this.ACCURATE_DX);
        return Math.floor(steps);
    }

    // takes midpoint riemann regardless of endpoints
    static properIntegral(funct, a, b, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        let dx = this.getIntegrationDx(a, b, steps, minDx);
        return this.midpointRiemann(funct, a, b, dx);
    }

    static isImproperIntegral(a, b) {
        return a <= -this.IntegrationInfinity || b >= this.IntegrationInfinity;
    }

    static testIntegrals() {
        // f(x) = c**x
        // int(f) from -inf to b = c^b / ln(c) (from -inf, b)
        let c = Math.random() * 5 + 1;
        let b = Math.random() * 6 - 3;
        let ans = c ** b / Math.log(c);
        let funct = (x) => {
            return c ** x;
        }
        let originalAns = Calculator.properIntegral(funct, -Calculator.IntegrationInfinity, b);
        let improperAns = Calculator.improperIntegral(funct, -Calculator.IntegrationInfinity, b);

        let originalError = Math.abs(originalAns - ans);
        let improperError = Math.abs(improperAns - ans);

        console.log('FUNCTION:');
        console.log(`${c}^x`);
        console.log('UPPER BOUND:');
        console.log(b);

        console.log('ACTUAL ANSWER');
        console.log(ans);

        console.log('ORIGINAL ANSWER');
        console.log(originalAns);
        console.log('IMPROPER ANSWER');
        console.log(improperAns);

        console.log('ORIGINAL ERROR');
        console.log(originalError);
        console.log('IMPROPER ERROR');
        console.log(improperError);

        let closerText = improperError < originalError ? 'IMPROPER' : 'ORIGINAL';
        console.log(closerText + ' CLOSER');
    }

    // riemann sum with step size inversely proportional to funct's derivative (second derivative of integral)
    static improperIntegral(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        return this.improperIntegralVariableSteps(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX);
    }

    static testTheThingImWorkingOn(funct, a, b, ans) {
        let trap = this.trapeziumIntegral(funct, a, b);
        let mid = this.midpointIntegral(funct, a, b);
        console.log('trap: ', trap);
        console.log('error: ', Math.abs(ans - trap));
        console.log('mid: ', mid);
        console.log('error: ', Math.abs(ans - mid));
    }

    static nonUniformTrapezoidalRiemannSum(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        // when change in change ( f⁽²⁾(x) ) is greater than threshold, take trapezoid
        // first, get total change (∫|f'(x)|)
        // we could take exactly ∫|f'(x)|, but this is slow and an approximation. 
        //      instead, let's take |f(cₙ) - f(cₙ₋₁)| for all cₙ = critical value
        // find critical values: f''(c) = 0
        const ABS_MAP_STEPS = 10;
        this.getAbsIntegral(funct, a, b, ABS_MAP_STEPS);
    }

    // ∫ |f'(x)|dx : total change f(x) undergoes
    // ∑|f(cₙ) - f(cₙ₋₁)| for all cₙ = critical value
    static totalChange(funct, a=-this.IntegrationInfinity, b=this.IntegrationInfinity, steps=this.getSteps(a, b, 100)) {
        // find all critical points

    }

    // no epsilon cushion, finds exact constant or uses max # of calls
    // find inverse f⁻¹(target) within a and b
    // returns random match if f(x) = target for multiple x values between a and b
    static inverseConstant(funct, target=0, a=-this.IntegrationInfinity, b=this.IntegrationInfinity, closest=NaN, calls=2**10) {
        if (calls <= 0) {
            console.log('OOF RAN OUTTA CALLLS SOWWYZ');
            console.log('HERES UR BOUNDWIES IF U ARE CUWIOUS');
            console.log(a, b);
            return closest;
        }

        // f(a)
        let fOfA = funct(a);
        // f(b)
        let fOfB = funct(b);
        
        let guess;
        // if target is between fOfA and fOfB
        if (this.between(target, fOfA, fOfB)) {
            guess = this.map(target, fOfA, fOfB, a, b);
        }
        // if target is not between fOfA and fOfB
        else {
            let range = b - a;
            let step = range / calls;
            guess = a + step;
        }

        let result = funct(guess);

        if (result === target) {
            console.log('CONGWATZUWATIONS U GOT IT AN D U EVEN HAD');
            console.log(calls + ' CAWWS VEFT');
            return guess;
        }

        let epsilon = Math.abs(target - result);
        if (epsilon < funct(closest) || isNaN(closest)) {
            console.log('NEW CLOSEST; YOU ARE ', epsilon, ' CLOSE:')
            console.log(`x=${guess}, y=${result}, target=${target}`);
            closest = guess;
        }

        // if f(guess) between [f(a), target]
        if (this.between(result, fOfA, target)) {
            b = guess;
        }
        // if target between [guess, b]
        else {
            a = guess;
        }
        return this.inverseConstant(funct, target, a, b, closest, calls - 1);
    }

    // variable # of steps depending on how much function changes
    static improperIntegralVariableSteps(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {

        // simplify endpoints with large bounds
        a = Math.max(-this.IntegrationInfinity, a);     // (∞, b]
        b = Math.min(this.IntegrationInfinity, b);      // [a, ∞)

        const range = b - a;

        const NORMAL_STEP = range / steps;

        // take integral, using variable weighted steps
        let step = NORMAL_STEP;
        let area = 0;
        console.log('STARTING');
        let numSteps = 0;
        for (let x = a; x < b; x += step) {
            numSteps ++;
            // dy / dx
            let change = this.derivative(funct, x);
            // abs | dy / dx |
            let absChange = Math.abs(change);
            // dx / dy
            let invChange = 1 / absChange;
            // (scale) * dx / dy
            let scaledDx = NORMAL_STEP * invChange;

            // // dy
            // let dy = absChange * NORMAL_STEP;

            // // dx / dy
            // let dx = NORMAL_STEP / dy;

            // dx ≤ step ≤ range
            step = this.constrain(dx, minDx, range);
            area += funct(x) * step;
        }
        console.log('FINISHED');
        console.log(area);
        console.log('num steps: ', numSteps);
        return area;
    }

    static improperIntegralConstantChangeMapping(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        // TOTAL CHANGE = ...;
        // CHANGE THRESHOLD = max(<TOTAL CHANGE>/ <# of STEPS>, minDy (prob just minDx) )
        // Take Rectangle + Triangle on top
        // Might be a variation of simpsons rule? See if any integral uses triangle
    }

    // keeps # of steps constant by mapping change to total change
    static improperIntegralConstantSteps(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {

        // simplify endpoints with large bounds
        a = Math.max(-this.IntegrationInfinity, a);     // (∞, b]
        b = Math.min(this.IntegrationInfinity, b);      // [a, ∞)

        const range = b - a;

        const NORMAL_STEP = range / steps;

        // total change (∫ₐᵇ f'(x) dx)
        const TOTAL_CHANGE = funct(b) - funct(a);

        console.log('THIS IS THE NORMAL STEP');
        console.log(NORMAL_STEP);
        // return;
        // take integral, using variable weighted steps
        let step = minDx;
        let area = 0;
        console.log('STARTING');
        for (let x = a; x < b; x += step) {
            // dy / dx
            let change = this.derivative(funct, x);
            // abs | dy / dx |
            let absChange = Math.abs(change);
            // absChange = Math.min(this.IntegrationInfinity, absChange);
            // // abs | dy |
            // changeValue = absChange * Calculator.ACCURATE_DX;
            // | dx / dy |
            // let changeValue = 1 / absChange;
            // if (changeValue > TOTAL_CHANGE) {
            //     console.error('UH OH BIG CHANGE');
            //     console.error(x, changeValue);
            // }
            // step = this.map(changeValue, 0, TOTAL_CHANGE, 0, range);
            // dy / dx * (normal dx)
            // dy
            let dy = absChange * NORMAL_STEP;
            // 1 / dy
            step = 1 / dy;
            // dx ≤ step ≤ range
            step = this.constrain(step, minDx, range);
            // if (step <= 0) {
            //     console.error('UH OH BAD STEP');
            //     console.error(x, step);
            // }
            // step ≥ minDx
            // step = Math.max(step, minDx);
            area += funct(x) * step;
            console.log('finished one loop')
            console.log(step, minDx, NORMAL_STEP);
            console.log(x, a, b);
        }
        console.log('FINISHED');
        return area;
    }

    // still not great, gonne rewrite
    // key differences from V2: weightmap dy/dx is gap between rectangles, not derivative at place
    static improperIntegralV3(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        a = Math.max(-this.IntegrationInfinity, a);
        b = Math.min(this.IntegrationInfinity, b);

        const range = b - a;
        minDx = Math.max(minDx, minDx * range);

        steps = Math.floor(Math.min(steps, range / minDx));

        // evaluate weights with 1/changeMapProportion steps
        const weightMapProportion = 20;
        const weightMapSteps = Math.floor(steps / weightMapProportion);
        const maxWeightMapArea = Number.MAX_SAFE_INTEGER;
        const minDerivValue = weightMapSteps / maxWeightMapArea;
        const weightMapStep = range / weightMapSteps;

        let totalChange = 0;

        const halfWeightMapStep = weightMapStep * 0.5;
        for (let x = a; x < b; x += weightMapStep) {
            let value = getChange(x - halfWeightMapStep);
            totalChange += value;
        }

        console.log('NET WEIGHT AREA');
        console.log(totalChange);

        let area = 0;
        let current = getWeight(a);
        let next = getWeight(a + weightMapStep - halfWeightMapStep);
        let step = current.step;

        let stepCount = 0;
        for (let x = a; x < b; x += step) {
            stepCount++;
            if (x > next.x) {
                current = next;
                next = getWeight(x + weightMapStep - halfWeightMapStep);
            }
            step = this.map(x, current.x, next.x, current.step, next.step);
            if (step < minDx) {
                step = minDx;
            }
            area += funct(x) * step;
        }
        console.log('STEP COUNT:');
        console.log(stepCount);

        return area;

        function getWeight(x) {
            return {
                x: x,
                step: getStepSize(x)
            };
        }
        function getStepSize(x) {
            let change = getChange(x);
            // step = Calculator.map(step, 0, netWeightArea, 0, range);
            let step = Calculator.map(change, 0, totalChange, range, 0);
            return Math.max(step, minDx);
        }
        // return abs |dy / dx| (dx = weightMapStep)
        function getChange(x) {
            let value = Calculator.derivative(funct, x, weightMapStep);
            value = Math.abs(value);
            value = Math.max(value, minDerivValue);
            value = Math.min(value, Calculator.IntegrationInfinity);
            return value;
        }
    }

    // riemann sum with step size inversely proportional to funct's derivative (second derivative of integral)
    static improperIntegralV2(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity, steps = this.STANDARD_INTEGRATION_STEPS, minDx=this.ACCURATE_DX) {
        a = Math.max(-this.IntegrationInfinity, a);
        b = Math.min(this.IntegrationInfinity, b);

        const range = b - a;
        minDx = Math.max(minDx, minDx * range);

        steps = Math.floor(Math.min(steps, range / minDx));

        // evaluate weights with 1/changeMapProportion steps
        const weightMapProportion = 20;
        const weightMapSteps = Math.floor(steps / weightMapProportion);
        const maxWeightMapArea = Number.MAX_SAFE_INTEGER;
        const minDerivValue = weightMapSteps / maxWeightMapArea;
        const weightMapStep = range / weightMapSteps;

        let netWeightArea = 0;

        for (let x = a; x < b; x += weightMapStep) {
            let value = getUnweightedValue(x);
            netWeightArea += value;
        }

        console.log('NET WEIGHT AREA');
        console.log(netWeightArea);

        let area = 0;
        let current = getWeight(a);
        let next = getWeight(a + weightMapStep);
        let step = current.step;

        let stepCount = 0;
        for (let x = a; x < b; x += step) {
            stepCount++;
            if (x > next.x) {
                current = next;
                next = getWeight(x + weightMapStep);
            }
            step = this.map(x, current.x, next.x, current.step, next.step);
            if (step < minDx) {
                step = minDx;
            }
            area += funct(x) * step;
        }
        console.log('STEP COUNT:');
        console.log(stepCount);

        return area;

        function getWeight(x) {
            return {
                x: x,
                step: getStepSize(x)
            };
        }
        function getStepSize(x) {
            let step = getUnweightedValue(x) / weightMapProportion;
            step = Calculator.map(step, 0, netWeightArea, 0, range);
            return Math.max(step, minDx);
        }
        function getUnweightedValue(x) {
            let value = Calculator.derivative(funct, x);
            value = Math.abs(value);
            value = Math.max(value, minDerivValue);
            value = 1 / value;
            return value;
        }
    }

    static improperIntegralV1(funct, a = -this.HALF_SAFE_INTEGER, b = this.HALF_SAFE_INTEGER, steps = this.STANDARD_INTEGRATION_STEPS, maxDx=this.ACCURATE_DX) {
        if (a < -this.HALF_SAFE_INTEGER) {
            a = -this.HALF_SAFE_INTEGER;
        }
        if (b > this.HALF_SAFE_INTEGER) {
            b = this.HALF_SAFE_INTEGER;
        }
        let range = b - a;
        console.log('range');
        console.log(range);
        let numMapped = Math.floor(steps / 20);
        console.log('numMapped');
        console.log(numMapped);
        let map = this.mapHotSpotsV1(funct, a, b, numMapped);
        console.log('mapped');
        console.log(map);
        console.log(map.slice(map.length - 100));
        let area = 0;
        let start = map[0].x;
        let end = map[map.length - 1].x;
        let step = 1;
        let spot, next;
        updateCurrent();
        for (let x = start; x < end; x += step) {
            if (x > next.x) {
                map.splice(0, 1);
                updateCurrent();
            }
            step = this.map(x, spot.x, next.x, spot.value, next.value);
            if (step < maxDx) {
                step = maxDx;
            }
            area += funct(x) * step;
        }
        return area;
        function updateCurrent() {
            if (map.length > 0) {
                spot = map[0];
            } else {
                spot = {
                    x: start,
                    value: range / steps
                }
            }
            if (map.length > 1) {
                next = map[1];
            } else {
                next = {
                    x: end,
                    value: range / steps
                }
            }
        }
    }

    static map(value, fromMin, fromMax, toMin, toMax) {
        return (value - fromMin) / (fromMax - fromMin) * (toMax - toMin) + toMin;
    }

    static constrain(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // note: order of a and b do not matter (not necessarily respective min and max)
    static between(value, a, b) {
        if (a < b) {
            return a < value && value < b;
        }
        // b < a
        return b < value && value < a;
    }

    static mapHotSpotsV1(funct, a, b, steps) {
        let spots = [];
        let range = b - a;
        let step = range / steps;
        let halfStep = step * 0.5;
        let calculatedArea = 0;
        console.log('mapping');
        console.log(step);
        let maxArea = Number.MAX_SAFE_INTEGER;
        let minDerivValue = 2 ** 24 * 1 / (maxArea * steps);
        console.log(1 / minDerivValue);
        console.log(steps / minDerivValue);
        for (let x = a + halfStep; x < b; x += step) {
            let derivValue = Math.abs(this.derivative(funct, x));
            derivValue = Math.min(derivValue, minDerivValue);
            let value = 1 / derivValue;
            calculatedArea += value;
            spots.push({
                x: x,
                value: value
            });
        }
        console.log('spots');
        console.log(spots);
        console.log(calculatedArea);
        let scaled = this.scaleHotSpotsV1(spots, calculatedArea, range);
        return scaled;
    }

    static scaleHotSpotsV1(spots, area, range) {
        let scaled = [];
        spots.forEach(spot => {
            scaled.push({
                x: spot.x,
                value: this.map(spot.value, 0, area, 0, range)
            });
        });
        return scaled;
    }

    static midpointRiemann(funct, a, b, step) {
        let halfStep = step * 0.5;
        return this.loopSum(a + halfStep, b, (x) => {
            return funct(x) * step;
        }, step);
    }


    static lefthandRiemann(funct, a, b, step) {
        return this.loopSum(a, b - step, (x) => {
            return funct(x) * step;
        }, step);
    }

    static trapeziumApproximation(funct, a, b, step) {
        let area = 0;
        let y = funct(a);
        for (let x = a + step; x <= b; x += step) {
            let lastY = y;
            y = funct(x);
            area += this.integralTrapezoid(step, lastY, y);
        }
        return area;
    }

    // trapezoid of an integral taken using the trapezium rule
    static integralTrapezoid(step, y1, y2) {
        return step * (y1 + y2) / 2;
    }

    /*=====  End of Calculus  ======*/


    /*=============================================
    =                Probability                  =
    =============================================*/



    /*----------  Discrete  ----------*/


    static binomialpmf(n, p, x) {
        return this.combination(n, x) * p ** x * (1 - p) ** (n - x);
    }

    static binomialcmf(n, p, x) {
        if (x < 0) {
            return 0;
        }
        return this.binomialpmf(n, p, x) + this.binomialcmf(n, p, x - 1);
    }

    static binomialMean(a, b, p, step = 1) {
        let n = (b - a) / step;
        return n - p;
    }

    static binomialVariance(a, b, p, step = 1) {
        let n = (b - a) / step;
        return n * p * (1 - p);
    }

    static binomialDeviation(a, b, p, step = 1) {
        return this.binomialVariance(a, b, p, step) ** 0.5;
    }

    static poissonpmf(lambda, x, T) {
        if (!T) {
            T = 1;
        }
        return (((lambda * T) ** x) * Math.E ** (- lambda * T)) / this.factorial(x);
    }

    static poissoncmf(lambda, x, T) {
        if (x < 0) {
            return 0;
        }
        return this.poissonpmf(lambda, x, T) + this.poissoncmf(lambda, x - 1, T);
    }

    static combination(n, r) {
        return this.permutation(n, r) / this.factorial(r);
    }

    static permutation(n, r) {
        return this.factorial(n) / this.factorial(n - r);
    }

    static factorial(n) {
        if (n > 0) {
            return n * this.factorial(n - 1);
        }
        if (n < 0 || !Number.isInteger(n)) {
            return null;
        }
        return 1;
    }

    // create discrete probabilistic mean from arguments
    static discreteMean(probabilities) {
        if (!Array.isArray(probabilities)) {
            probabilities = [...arguments];
        }
        if (!probabilities.length) {
            return 0;
        }
        let probability = probabilities.splice(0, 1)[0];
        return probability.x * probability.p + this.discreteMean(probabilities);
    }

    // calculate variance of arguments
    static discreteVariance(probabilities) {
        if (!Array.isArray(probabilities)) {
            probabilities = [...arguments];
        }
        if (!probabilities.length) {
            return 0;
        }
        let probability = probabilities.splice(0, 1)[0];
        return (probability.x ** 2 - probability.x) * probability.p + this.discreteVariance(probabilities);
    }

    // calculate standard deviation of arguments
    static discreteDeviation(probabilities) {
        if (!Array.isArray(probabilities)) {
            probabilities = [...arguments];
        }
        return Math.sqrt(this.discreteVariance(probabilities));
    }

    static discreteUniformMean(a, b) {
        return (a + b) / 2;
    }

    static discreteUniformVariance(a, b, step = 1) {
        let n = (b - a) / step;
        return ((n * n - 1) / 12) * step;
    }

    static discreteUniformDeviation(a, b, step = 1) {
        return this.discreteUniformVariance(a, b, step) ** 0.5;
    }

    static createProbability(x, p) {
        return {
            x: x,
            p: p
        };
    }


    /*----------  Continuous  ----------*/



    // ⌠ᵇ  
    // ⌡ₐ x * f(x)𝑑𝑥
    static continuousMean(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity) {
        return this.integral((x) => {
            return x * funct(x);
        }, a, b);
    }

    // ⌠ᵇ               ⌠ᵇ
    // ⌡ₐ x² * f(x)𝑑𝑥 - ⌡ₐ x² * f(x)𝑑𝑥
    // E(X²) - μ² = 
    static continuousVariance(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity) {
        // E(X²)
        let eXSq = this.integral((x) => {
            return x * x * funct(x);
        }, a, b);
        // E(X²) - μ²
        return eXSq - this.continuousMean(funct, a, b) ** 2;
    }

    // σ = √V(X)
    static continuousDeviation(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity) {
        return this.continuousVariance(funct, a, b) ** 0.5;
    }

    static continuouscdf(funct, a = -this.IntegrationInfinity, b = this.IntegrationInfinity) {
        return this.integral(funct, a, b);
    }

    static continuousUniformpdf(a = -Infinity, b = Infinity) {
        return 1 / (b - a);
    }

    static continuousUniformcdf(x, a = -Infinity, b = Infinity) {
        if (x < a) {
            return 0;
        }
        if (x > b) {
            return 1;
        }
        return (x - a) / (b - a);
    }

    static continuousUniformMean(a, b) {
        return (a + b) / 2;
    }

    static continuousUniformVariance(a, b) {
        return ((b - a) ** 2) / 12;
    }

    static continuousUniformDeviation(a, b) {
        return (b - a) / 12 ** 0.5;
    }


    /*----------  Normal Distribution  ----------*/


    //         (-(x-μ)² / (2σ²))
    // p(x) = e^ / √2πσ
    // much more accurate to standardize then take cdf f(z) (normalpdf)
    static actualNormalpdf(x, mean, deviation) {
        // -(x-μ)²
        let exponentNumerator = -1 * (x - mean) ** 2;
        // 2σ²
        let exponentDenominator = 2 * deviation ** 2;
        // -(x-μ)² / (2σ²)
        let exponent = exponentNumerator / exponentDenominator;
        // e^(-(x-μ)² / (2σ²))
        let numerator = Math.E ** exponent;
        // √2πσ
        let denominator = (2 * Math.PI * deviation) ** 0.5;
        // ( e^(-(x-μ)² / (2σ²)) ) / √2πσ
        return numerator / denominator;
    }

    // much more accurate to standardize then take cdf Φ(z) (normalcdf)
    static actualNormalcdf(a = -Infinity, b = Infinity, mean, deviation) {

        // finite bounds
        // x ∈ [finite a, finite b]
        if (a > -this.IntegrationInfinity && b < this.IntegrationInfinity) {
            // cdf(a, b)
            return this.integral(x => {
                return this.actualNormalpdf(x, mean, deviation);
            }, a, b);
        }

        // infinite lower, finite upper
        // x ∈ (-∞, finite b]
        if (a < -this.IntegrationInfinity + 1 && b < this.IntegrationInfinity) {
            if (b > mean) {
                // cdf(-∞, μ) + cdf(μ, b)
                return 0.5 + this.actualNormalcdf(mean, b, mean, deviation);
            } else {
                // cdf(-∞, μ) - cdf(μ, b)
                return 0.5 - this.actualNormalcdf(b, mean, mean, deviation);
            }
        }

        // finite lower, infinite upper
        // x ∈ [finite a, ∞)
        if (a > -this.IntegrationInfinity && b > this.IntegrationInfinity - 1) {
            if (a > mean) {
                // cdf(-∞, μ) - cdf(μ, a)
                return 0.5 - this.actualNormalcdf(mean, a, mean, deviation);
            } else {
                // cdf(-∞, μ) + cdf(μ, a)
                return 0.5 + this.actualNormalcdf(a, mean, mean, deviation);
            }
        }

        // infinite bounds
        // x ∈ (-∞, ∞)
        return 1;

    }

    // much more accurate to normalize then take cdf Φ(z)
    static normalcdf(a = -Infinity, b = Infinity, mean = 0, deviation = 1) {
        return this.standardNormalcdf(this.standardizeNormal(a, mean, deviation), this.standardizeNormal(b, mean, deviation));
    }

    // much more accurate to normalize then take cdf f(z)
    static normalpdf(x, mean = 0, deviation = 1) {
        return this.standardNormalpdf(this.standardizeNormal(x, mean, deviation));
    }

    //         -z² /2
    // p(z) = e^ / √2π
    static standardNormalpdf(z) {
        // -z² /2
        let exponent = (-1 * z ** 2) / 2;
        // e^(-z² /2)
        let numerator = Math.E ** exponent;
        // √2π
        let denominator = (2 * Math.PI) ** 0.5;
        // e^(-z² /2) / √2π 
        return numerator / denominator;
    }

    static standardNormalcdf(a = -Infinity, b = Infinity) {
        // finite bounds
        // x ∈ [finite a, finite b]
        if (a > -this.IntegrationInfinity && b < this.IntegrationInfinity) {
            // cdf(a, b)
            return this.integral(x => {
                return this.standardNormalpdf(x);
            }, a, b);
        }

        // infinite lower, finite upper
        // x ∈ (-∞, finite b]
        if (a < -this.IntegrationInfinity + 1 && b < this.IntegrationInfinity) {
            if (b > 0) {
                // cdf(-∞, b) = cdf(-∞, 0) + cdf(0, b)
                return 0.5 + this.standardNormalcdf(0, b);
            } else {
                // cdf(-∞, b) = cdf(-∞, 0) - cdf(0, b)
                return 0.5 - this.standardNormalcdf(b, 0);
            }
        }

        // finite lower, infinite upper
        // x ∈ [finite a, ∞)
        if (a > -this.IntegrationInfinity && b > this.IntegrationInfinity - 1) {
            if (a > 0) {
                // cdf(-∞, a) = cdf(-∞, 0) - cdf(0, a)
                return 0.5 - this.standardNormalcdf(0, a);
            } else {
                // cdf(-∞, a) = cdf(-∞, 0) + cdf(0, a)
                return 0.5 + this.standardNormalcdf(a, 0);
            }
        }

        // infinite bounds
        // x ∈ (-∞, ∞)
        return 1;
    }

    static inverseNormal(area, mean = 0, deviation = 1) {
        let z = this.inverseStandardNormal(area);
        return this.unstandardizeNormal(z, mean, deviation);
    }

    static inverseStandardNormal(area) {
        if (area > 1) {
            return;
        }
        let total;
        let start, max;
        // area < 0.5
        for (let i = 1; i < this.standardNormalDistributions.length && !total; i++) {
            if (this.standardNormalDistributions[i].area > area) {
                max = this.standardNormalDistributions[i].z;
                start = this.standardNormalDistributions[i - 1].z;
                total = this.standardNormalDistributions[i - 1].area;
            }
        }
        // area > 0.5
        for (let i = 1; i < this.standardNormalDistributions.length && !total; i++) {
            if ((1 - this.standardNormalDistributions[i].area) < area) {
                max = - this.standardNormalDistributions[i - 1].z;
                start = -1 * this.standardNormalDistributions[i].z;
                total = 1 - this.standardNormalDistributions[i].area;
            }
        }
        // gap between [0.5 - ϵ, 0.5 + ϵ]
        if (Math.abs(0.5 - area) <= this.standardNormalDistributions[0].area) {
            max = -1 * this.standardNormalDistributions[this.standardNormalDistributions.length - 2].z;
            start = this.standardNormalDistributions[this.standardNormalDistributions.length - 2].z;
            total = this.standardNormalDistributions[this.standardNormalDistributions.length - 2].area;
        }
        // if x = 0 + ϵ or 1 - ϵ
        if (!total) {
            if (area > 0) {
                return Infinity;
            } else {
                return -Infinity;
            }
        }

        //            end
        //           ⌠      
        // integrate ⌡𝑓(𝑥)𝑑𝑥 ; check each step to see if it crossed
        //           start
        let steps = this.STANDARD_INTEGRATION_STEPS;
        let dx = Math.max((max - start) / steps, this.ACCURATE_DX);
        for (let z = start + dx * 0.5; z < max; z += dx) {
            total += this.standardNormalpdf(z) * dx;
            if (total > area) {
                return z - dx * 0.5;
            }
        }

    }

    static standardizeNormal(x, mean, deviation) {
        return (x - mean) / deviation;
    }

    static unstandardizeNormal(z, mean, deviation) {
        return z * deviation + mean;
    }


    /*----------  Exponential  ----------*/


    static exponentialpdf(lambda, x) {
        return lambda * Math.E ** (- lambda * x);
    }

    static exponentialcdf(lambda, x) {
        return 1 - Math.E ** (- lambda * x)
    }

    static exponentialMean(lambda) {
        return 1 / lambda;
    }

    static exponentialVariance(lambda) {
        return 1 / lambda ** 2;
    }

    static exponentialDeviation(lambda) {
        return 1 / lambda;
    }

    /*=====  End of     Probability        ======*/

}