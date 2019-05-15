import "./index.scss"

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