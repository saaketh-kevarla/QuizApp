import { useState, useEffect, useRef } from 'react';
import {styled} from 'styled-components';
import { questions } from '../questions'; // Assuming this path is correct
import { Results } from './Results';

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
    }
    
    & .options ul li.isSelected {
        background-color : orange;
        color : pink;
    }
    
    & .options ul li.isIncorrect {
        background-color : red;
        color : white;
    }

    & .options ul li.isCorrect {
        background-color : green;
        color : yellow;
    }

    & li:hover {
        background-color : #5D3FD3;
    }

    & li:hover p {
        color : white;
    }
`;

export default function MCQ(){

     const arr = new Array(7);
     
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(arr); 
    const [progressVal, setProgressVal] = useState(3000); 
    const [selectProgress, setSelectProgress] = useState(1500);
    const [feedbackPhase,setFeedbackPhase] = useState(false);

    const autoAdvanceTimerRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const selectTimerRef = useRef(null);
    const selectProgressIntervalRef = useRef(null);

   
    

    useEffect(() => {
        if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current);
        }

        if (currentQuestionIndex < questions.length && selectedOptions[currentQuestionIndex] === undefined) {
            autoAdvanceTimerRef.current = setTimeout(() => {
                setCurrentQuestionIndex((prevQ) => prevQ + 1);
            }, 3000);
        }

        return () => {
            clearTimeout(autoAdvanceTimerRef.current);
        };
    }, [currentQuestionIndex, selectedOptions]); 


    useEffect(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        setProgressVal(3000);

        if (selectedOptions[currentQuestionIndex] === undefined && currentQuestionIndex < questions.length) {
            progressIntervalRef.current = setInterval(() => {
                setProgressVal((prevVal) => {
                    if (prevVal <= 0) {
                        clearInterval(progressIntervalRef.current);
                        return 0;
                    }
                    return prevVal - 10;
                });
            }, 10);
        }

        return () => {
            clearInterval(progressIntervalRef.current);
        };
    }, [currentQuestionIndex, selectedOptions]); 


    useEffect(() => {

        if (selectTimerRef.current) {
            clearTimeout(selectTimerRef.current);
        }
        if (selectProgressIntervalRef.current) {
            clearInterval(selectProgressIntervalRef.current);
        }


        setSelectProgress(1500);

 
        if (selectedOptions[currentQuestionIndex] !== undefined && currentQuestionIndex < questions.length && !feedbackPhase)  {
            selectProgressIntervalRef.current = setInterval(() => {
                setSelectProgress((prevProgress) => {
                    if (prevProgress <= 0) {
                        clearInterval(selectProgressIntervalRef.current);
                        return 0;
                    }
                    return prevProgress - 10;
                });
            }, 10);
            
            selectTimerRef.current = setTimeout(() => {
                        setFeedbackPhase(true);
                    },1500);
        }
        return () => {
            clearTimeout(selectTimerRef.current);
            clearInterval(selectProgressIntervalRef.current);
        };
    }, [currentQuestionIndex, selectedOptions[currentQuestionIndex],feedbackPhase]); // <-- This dependency is crucial


    useEffect(() => {
         if (selectTimerRef.current) {
            clearTimeout(selectTimerRef.current);
        }
        if (selectProgressIntervalRef.current) {
            clearInterval(selectProgressIntervalRef.current);
        }

        setSelectProgress(1500);

        if(feedbackPhase){
            selectProgressIntervalRef.current = setInterval(() => {
                setSelectProgress((prevProgress) => {
                    if (prevProgress <= 0) {
                        clearInterval(selectProgressIntervalRef.current);
                        return 0;
                    }
                    return prevProgress - 10;
                });
            }, 10);

        selectTimerRef.current = setTimeout(() => {
                setCurrentQuestionIndex((prevQ) => {
                    if (prevQ <= questions.length - 1) {
                        setFeedbackPhase(false);
                        return prevQ + 1;
                    }
                     
                });
            }, 1500);

        return () => {
            clearTimeout(selectTimerRef.current);
            clearInterval(selectProgressIntervalRef.current);
        };

        }
    },[feedbackPhase])

    
    function handleSelectOption(index){
       if (selectedOptions[currentQuestionIndex] === undefined && !feedbackPhase) {
            setSelectedOptions((prevOptions) => {
                const newOptions = [...prevOptions];
                newOptions[currentQuestionIndex] = index;
                return newOptions;
            });
            if (autoAdvanceTimerRef.current) {
                clearTimeout(autoAdvanceTimerRef.current);
            }
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
       }
    }

    let correctAns = 0;

    if(currentQuestionIndex >= questions.length){
        for (let i = 0; i < questions.length; i++) {
            if (selectedOptions[i] === 0) { 
                correctAns++;
            }
        }
        return (
            <MCQDiv>
               <Results selectedOptions = {selectedOptions}> </Results>
            </MCQDiv>
        );
    }

    return (
        <MCQDiv>
            <progress 
                value={selectedOptions[currentQuestionIndex] !== undefined ? selectProgress : progressVal} 
                max={selectedOptions[currentQuestionIndex] !== undefined ? 1500 : 3000} 
            ></progress>
            <h3>{questions[currentQuestionIndex].text}</h3>

            <div className='options'>
                <ul>
                    {questions[currentQuestionIndex].answers.map((ele,ind) => {
                        let nameclass ;
                        if(selectedOptions[currentQuestionIndex] !== undefined){
                            if(feedbackPhase){
                                if(selectedOptions[currentQuestionIndex] === 0){
                                    nameclass = 'isCorrect';
                                }
                                else if (ind === selectedOptions[currentQuestionIndex]){
                                    nameclass = 'isIncorrect'
                                }
                            }
                            else if (ind === selectedOptions[currentQuestionIndex]){
                                nameclass = 'isSelected';
                            }
                        }

                        return (
                        <li 
                            key={ind} 
                            onClick={() => handleSelectOption(ind)} 
                            className={selectedOptions[currentQuestionIndex] === ind ? nameclass : undefined}
                        >
                            <p>{ele}</p>
                        </li>
                        );
                    })}
                </ul>
            </div>
        </MCQDiv>
    );
}