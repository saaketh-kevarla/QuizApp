import { useState, useEffect } from 'react';
import {styled} from 'styled-components';
import { questions } from '../questions';

const MCQDiv = styled.div`
    & h3{
        color : white;
        font-size : 3.5vh;
    }

    & .options ul {
        list-style-type : none;
    }

    & li {
        cursor : pointer;
        padding : 0px 5px;
        border : 1px solid black;
        border-radius : 40px;
        width : 60vw;
        height : 7vh;
        margin : 1vh;
        background-color : #00CED1;
        display : flex;
        align-items: center;
        justify-content : center;
    }

    & li p{
        font-size : 3vh;
        color : black;
        //text-align : start;
       
    }

    & li:hover {
        background-color : #5D3FD3;
    }

    & li:hover p {
        color : white;
    }

`

export default function MCQ(){
    const [question, setQuestion] = useState(0);
    const [progressval,setProgressVal] = useState(3000);
    

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('open');
            setQuestion((prevQ) => {
                if(prevQ < questions.length - 1){
                return prevQ +1
                }
                return questions.length - 1
            }
        )},3000)

        return () =>{
            console.log('close');
            clearTimeout(timer);
        }
    },[question]);



    useEffect(() =>{
        const interval = setInterval(() => {
            setProgressVal((prevVal) => prevVal - 10)
        },10)

        return () => {
            clearInterval(interval);
            setProgressVal(3000);
        }
    },[question])



    return (
        <MCQDiv>
            <progress value={progressval} max={3000} ></progress>
            <h3>{questions[question].text}</h3>

            <div className='options'>
                <ul>
                    {questions[question].answers.map((ele,ind) => <li key={ind}><p>{ele}</p></li>)}
                </ul>
            </div>
        </MCQDiv>
    )
}