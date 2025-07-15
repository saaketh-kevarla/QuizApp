import styled from "styled-components"
import { useState } from "react";
import quizlogo from '../assets/quiz-complete.png';
import { questions } from "../questions";

const ResultsDiv = styled.div`

    & img { 
        height : 20vh;
        width : 9vw;
        border : 4px solid black;
        //padding : 20px;
        object-fit : contain;
        border-radius : 50%;
        padding  : 10px;
    }

    & h1 {
        color : white;
    }

    & .container1 {
        display : flex;
        justify-content : center;
        gap : 50px;
        height : 15vh;
        width : 50vw;
        background-color : teal;

    }

    & .container1 .div1 {
        font-size : 8vh;
        color : white;
    }

    & .container1 .div2 {
        color : yellow;
        width : 5vw;
        //background-color : yellow;
    }

    

`
export function Results({selectedOptions}){
    let length = questions.length
    let skipped = 0;
    let correct = 0;
    let wrong = 0;
    selectedOptions.map((ele) => {
        if(ele === undefined ){
            skipped++;
        }
        else if(ele === 0){
            correct++;
        }
        else {
            wrong++;
        }
    })

    const Result = [skipped/length , correct/length ,wrong/length];
    const Rnames = ['skipped','answer correctly','answer incorrectly'];
    return(
        <>
            <ResultsDiv>
                <img src={quizlogo} alt="quiz-complete logo" />
                <h1>QUIZ COMPLETED!</h1>
                <div>
                    <div className="container1">
                        {Result.map((ele,ind) => <div key={ind}><div className="div1">{Math.round((ele*100).toFixed(2))+'%'}</div><div className='div2'>{Rnames[ind]}</div></div>)}
                    </div>
                </div>
                
            </ResultsDiv>
        </>
    )
}