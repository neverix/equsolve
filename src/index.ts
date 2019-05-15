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
    k1: number
    b1: number
    c1: number
    k2: number
    b2: number
    c2: number
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
        x = 0
        <br>
        y = 0
    `
}
const solvers: { [method: string]: (eq: Equation) => TemplateResult }
    = { solveAddition, solveReplacement }

const methods = document.getElementsByName("method")
const solutionContainer = document.getElementById("solution")
function solveEquation() {
    console.log("Solving...")

    const equation = {} as Equation;
    ['k1', 'b1', 'c1', 'k2', 'b2', 'c2'].forEach(param => {
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