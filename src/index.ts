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
    return html`
        <p>
            ${equation.a1}𝑥 ${signAbs(equation.b1)}𝑦 = ${equation.c1}
            <br>
            ${equation.a2}𝑥 ${signAbs(equation.b2)}𝑦 = ${equation.c2}
        </p>
        <p>
            ${equation.b1}𝑦 = ${equation.c1} ${signAbs(-equation.a1)}𝑥
            <br>
            ${equation.a2}𝑥 = ${equation.c2} ${signAbs(-equation.b2)}𝑦
        </p>
        <p>
            ${''}𝑦 = ${fix(equation.c1 / equation.b1)} ${signAbs(-equation.a1 / equation.b1)}𝑥
            <br>
            ${''}𝑥 = ${fix(equation.c2 / equation.a2)} ${signAbs(-equation.b2 / equation.a2)}𝑦
        </p>
        <p>
            ${''}𝑥 = ${fix(equation.c2 / equation.a2)} ${signAbs(-equation.b2 / equation.a2)}(${fix(equation.c1 /
                equation.b1)} ${signAbs(-equation.a1 / equation.b1)}𝑥)
        </p>
        <p>
            ${''}𝑥 = ${fix(equation.c2 / equation.a2)} ${signAbs(equation.c1 /
                equation.b1 * (-equation.b2 / equation.a2))} ${signAbs(-equation.a1 / equation.b1 * (-equation.b2 / equation.a2))}𝑥
        </p>
        <p>
            ${fix(1 - (-equation.a1 / equation.b1 * (-equation.b2 / equation.a2)))}𝑥 = ${fix(equation.c2 / equation.a2 + equation.c1 /
                equation.b1 * (-equation.b2 / equation.a2))}
        </p>
        <p>
            ${''}𝑥 = ${fix((equation.c2 / equation.a2 + equation.c1 / equation.b1 * (-equation.b2 / equation.a2)) /
                (1- (-equation.a1 / equation.b1 * (-equation.b2 / equation.a2))))}
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