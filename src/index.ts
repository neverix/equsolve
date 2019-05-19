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

function solveAddition(equation: Equation): TemplateResult {
    return html`
        x = 0
        <br>
        y = 0
    `
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
    const step7Multiplier = step6X
    const 

    return html`
        <p>
            ${step0YX}𝑥 ${signAbs(step0YY)}𝑦 = ${step0YNumber}
            <br>
            ${step0XX}𝑥 ${signAbs(step0XY)}𝑦 = ${step0XNumber}
        </p>
        <p>
            ${step1YY}𝑦 = ${step1YNumber} ${signAbs(step1YX)}𝑥
            <br>
            ${step1XX}𝑥 = ${step1XNumber} ${signAbs(step1XY)}𝑦
        </p>
        <p>
            ${''}𝑦 = ${fix(step2YNumber)} ${signAbs(step2YX)}𝑥
            <br>
            ${''}𝑥 = ${fix(step2XNumber)} ${signAbs(step2XY)}𝑦
        </p>
        <p>
            ${''}𝑥 = ${fix(step3Number)} ${signAbs(step3XMultiplier)}(${fix(step3X1)} ${signAbs(step3X2)}𝑥)
        </p>
        <p>
            ${''}𝑥 = ${fix(step4Number)} ${signAbs(step4X1)} ${signAbs(step4X2)}𝑥
        </p>
        <p>
            ${fix(step5X)}𝑥 = ${fix(step5Number)}
        </p>
        <p>
            ${''}𝑥 = ${fix(step6X)}
        </p>
        <p>
            ${''}𝑦 = ${fix(equation.c1 / equation.b1)} ${signAbs(-equation.a1 / equation.b1)} ⋅ ${fixParenthesize((equation.c2 /
                equation.a2 + equation.c1 / equation.b1 * (-equation.b2 / equation.a2)) / (1 - (-equation.a1 / equation.b1 *
                (-equation.b2 / equation.a2))))}
        </p>
        <p>
            ${''}𝑦 = ${fix(equation.c1 / equation.b1)} ${signAbs(-equation.a1 / equation.b1 * ((equation.c2 /
            equation.a2 + equation.c1 / equation.b1 * (-equation.b2 / equation.a2)) / (1 - (-equation.a1 / equation.b1 *
                (-equation.b2 / equation.a2)))))}
        </p>
        <p>
            ${''}𝑦 = ${fix(equation.c1 / equation.b1 + (-equation.a1 / equation.b1 * ((equation.c2 /
                equation.a2 + equation.c1 / equation.b1 * (-equation.b2 / equation.a2)) / (1 - (-equation.a1 / equation.b1 *
                (-equation.b2 / equation.a2))))))}
        </p>
        <p>
            Ответ: (${
                fix((equation.c2 / equation.a2 + equation.c1 / equation.b1 * (-equation.b2 / equation.a2)) /
                    (1- (-equation.a1 / equation.b1 * (-equation.b2 / equation.a2))))
            };
            ${
                fix(equation.c1 / equation.b1 + (-equation.a1 / equation.b1 * ((equation.c2 /
                    equation.a2 + equation.c1 / equation.b1 * (-equation.b2 / equation.a2)) / (1 - (-equation.a1 / equation.b1 *
                    (-equation.b2 / equation.a2))))))
            })
        </p>
    `
}
const solvers: { [method: string]: (eq: Equation) => TemplateResult }
    = { solveAddition, solveReplacement }

const methods = document.getElementsByName("method")
const solutionContainer = document.getElementById("solution")
function solveEquation() {
    const equation = {} as Equation
    ['a1', 'b1', 'c1', 'a2', 'b2', 'c2'].forEach(param => {
        //@ts-ignore
        equation[param] = (document.getElementById(param) as HTMLInputElement).value
    });

    for (let i = 0; i < methods.length; i++) {
        const radio = methods.item(i) as HTMLInputElement
        if (radio.checked) {
            const result = solvers[radio.value](equation)
            render(result, solutionContainer)
            return
        }
    }
}

document.getElementById("solve").onclick = solveEquation