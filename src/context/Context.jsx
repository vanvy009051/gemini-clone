import { createContext, useState } from "react";
import PropTypes from 'prop-types'
import run from "../configs/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompt, setPrevPrompt] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    const delayPara = (index,nextWord) => {
        setTimeout(function() {
            setResultData(prev => prev + nextWord)
        },75*index) 
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response
        if (prompt !== undefined) {
            response = await run(prompt)
            setRecentPrompt(prompt)
        }
        else {
            setPrevPrompt(prev => [...prev, input])
            setRecentPrompt(input)
            response = await run(input)
        }
        let responseArray = response.split('**')
        let newResponse = " ";
        for(let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i]
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>"
            }
        }
        let splitResponse = newResponse.split("*").join("</br>")
        let lastResponse = splitResponse.split(" ")
        for(let i = 0; i < lastResponse.length; i++) {
            const nextWord = lastResponse[i]
            delayPara(i, nextWord + " ")
        }
        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompt,
        setPrevPrompt,
        onSent,
        input,
        setInput,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        newChat,
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ContextProvider;