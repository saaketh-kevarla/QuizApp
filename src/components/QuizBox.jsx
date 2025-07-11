import { useState } from 'react';
import {styled} from 'styled-components'
import MCQ from './MCQ'


const QuizBoxDiv = styled.div`
border : 1px solid salmon;
height : 70vh;
width : 70vw;
display : flex;
justify-content : center;
background-color : #452c63;

& #div1{
    margin-top : 6vh;
    text-align : center; 
}

& progress {
    width : 25vw;
    
}


`

export default function QuizBox(){
     
    return (
       <QuizBoxDiv>
            <div id='div1'>
                {/* <progress value={progressval} max={3000} ></progress> */}
                <MCQ />
            </div>
       </QuizBoxDiv>
    )
}