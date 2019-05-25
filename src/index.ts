import "./index.scss"
import { TemplateResult, html, render } from "lit-html"

const numberInput = document.getElementsByClassName("number-input")
const numberOutput = document.getElementsByClassName("number-output")
addAutoResize(numberInput)
addAutoResize(numberOutput)

function addAutoResize(elements: HTMLCollection) {
    for (let i = 0; i < elements.length; i++) {
        const element = elements.item(i) as HTMLDivElement
        const initialWidth = element.clientWidth
        const input = element.getElementsByTagName("input").item(0)

        const onEvent = () => {
            element.style.width = (initialWidth * input.value.length).toString() + "px"
            if (input.value.length == 0) {
                element.style.width = initialWidth + "px"
            }
        }
        onEvent()
        input.onkeyup = onEvent
    }
}

interface Equation {
    a1: number
    b1: number
    c1: number
    a2: number
    b2: number
    c2: number
}

function abs(n: number) {
    return n < 0 ? -n : n
}

function sign(n: number) {
    return n < 0 ? '-' : '+'
}

function fix(n: number) {
    return parseFloat(n.toFixed(2)).toString()
}

function fixParenthesize(n: number) {
    const fixed = fix(n)
    if(n < 0) {
        return `(${fixed})`
    } else {
        return fixed
    }
}

function signAbs(n: number) {
    if (typeof n == "string") {
        n = parseFloat(n)
    }
    return sign(n) + ' ' + fix(abs(n))
}

function solveReplacement(equation: Equation): TemplateResult {
    const step0YX = equation.a1
    const step0YY = equation.b1
    const step0YNumber = equation.c1
    
    const step0XX = equation.a2
    const step0XY = equation.b2
    const step0XNumber = equation.c2

    const step1YY = step0YY
    const step1YNumber = step0YNumber
    const step1YX = -step0YX

    const step1XX = step0XX
    const step1XNumber = step0XNumber
    const step1XY = -step0XY

    const step2YNumber = step1YNumber / step1YY
    const step2YX = step1YX / step1YY

    const step2XNumber = step1XNumber / step1XX
    const step2XY = step1XY / step1XX

    const step3Number = step2XNumber
    const step3XMultiplier = step2XY
    const step3X1 = step2YNumber
    const step3X2 = step2YX

    const step4Number = step3Number
    const step4X1 = step3X1 * step3XMultiplier
    const step4X2 = step3X2 * step3XMultiplier

    const step5X = 1 - step4X2
    const step5Number = step4Number + step4X1

    const step6X = step5Number / step5X

    const step7Number = step2YNumber
    const step7Multiplier = step2YX
    const step7X = step6X

    const step8Number1 = step7Number
    const step8Number2 = step7Multiplier * step7X

    const step9Y = step8Number1 + step8Number2
    
    const x = step6X, y = step9Y

    return html`
        <p>
            ${step0YX}x ${signAbs(step0YY)}y = ${step0YNumber}
            <br>
            ${step0XX}x ${signAbs(step0XY)}y = ${step0XNumber}
        </p>
        <p>
            ${step1YY}y = ${step1YNumber} ${signAbs(step1YX)}x
            <br>
            ${step1XX}x = ${step1XNumber} ${signAbs(step1XY)}y
        </p>
        <p>
            ${''}y = ${fix(step2YNumber)} ${signAbs(step2YX)}x
            <br>
            ${''}x = ${fix(step2XNumber)} ${signAbs(step2XY)}y
        </p>
        <p>
            ${''}x = ${fix(step3Number)} ${signAbs(step3XMultiplier)}(${fix(step3X1)} ${signAbs(step3X2)}x)
        </p>
        <p>
            ${''}x = ${fix(step4Number)} ${signAbs(step4X1)} ${signAbs(step4X2)}x
        </p>
        <p>
            ${fix(step5X)}x = ${fix(step5Number)}
        </p>
        <p>
            ${''}x = ${fix(step6X)}
        </p>
        <p>
            ${''}y = ${fix(step7Number)} ${signAbs(step7Multiplier)} ⋅ ${fixParenthesize(step7X)}
        </p>
        <p>
            ${''}y = ${fix(step8Number1)} ${signAbs(step8Number2)}
        </p>
        <p>
            ${''}y = ${fix(step9Y)}
        </p>
        <p>
            Ответ: (${fix(x)}; ${fix(y)})
        </p>
    `
}

const solutionContainer = document.getElementById("solution")
function solveEquation() {
    const equation = {} as Equation
    ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'].forEach(param => {
        //@ts-ignore
        equation[param] = (document.getElementById(param) as HTMLInputElement).value
    });

    const result = solveReplacement(equation)
    render(result, solutionContainer)
}

document.getElementById("solve").onclick = solveEquation