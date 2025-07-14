import { useState, useEffect, useRef } from 'react';
import {styled} from 'styled-components';
import { questions } from '../questions'; // Assuming this path is correct

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

    & li:hover {
        background-color : #5D3FD3;
    }

    & li:hover p {
        color : white;
    }
`;

export default function MCQ(){
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]); // Stores the index of the selected option for each question
    const [progressVal, setProgressVal] = useState(3000); // Progress for auto-advance
    const [selectProgress, setSelectProgress] = useState(1500);

    const autoAdvanceTimerRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const selectTimerRef = useRef(null);
    const selectProgressIntervalRef = useRef(null);
    
    // Effect for auto-advancing the question after 3 seconds if no option is selected
    useEffect(() => {
        if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current);
        }
        // Only set the auto-advance timer if an option hasn't been selected for the current question
        // and we are not at the end of the questions.
        if (currentQuestionIndex < questions.length && selectedOptions[currentQuestionIndex] === undefined) {
            autoAdvanceTimerRef.current = setTimeout(() => {
                setCurrentQuestionIndex((prevQ) => prevQ + 1);
            }, 3000);
        }

        return () => {
            clearTimeout(autoAdvanceTimerRef.current);
        };
    }, [currentQuestionIndex, selectedOptions]); // Re-run if question changes or an option is selected

    // Effect for the 3-second progress bar (auto-advance)
    useEffect(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        setProgressVal(3000);

        // Only run this progress bar if no option is selected for the current question
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
    }, [currentQuestionIndex, selectedOptions]); // Re-run if question changes or an option is selected

    // Effect for the 1.5-second timer and progress bar after an option is selected
    useEffect(() => {
        // Clear any existing timers/intervals for selection progress
        if (selectTimerRef.current) {
            clearTimeout(selectTimerRef.current);
        }
        if (selectProgressIntervalRef.current) {
            clearInterval(selectProgressIntervalRef.current);
        }

        // Reset select progress
        setSelectProgress(1500);

        // Only start the selection timer and progress if an option IS selected for the current question
        // and we are not at the end of the questions.
        if (selectedOptions[currentQuestionIndex] !== undefined && currentQuestionIndex < questions.length) {
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
                    if (prevQ < questions.length - 1) {
                        return prevQ + 1;
                    }
                    return prevQ; 
                });
            }, 1500);
        }

        return () => {
            clearTimeout(selectTimerRef.current);
            clearInterval(selectProgressIntervalRef.current);
        };
    }, [currentQuestionIndex, selectedOptions[currentQuestionIndex]]); // <-- This dependency is crucial

    // handleSelectOption function (no useCallback)
    function handleSelectOption(index){
       // Only allow selection if an option hasn't already been chosen for this question
       if (selectedOptions[currentQuestionIndex] === undefined) {
            setSelectedOptions((prevOptions) => {
                const newOptions = [...prevOptions];
                newOptions[currentQuestionIndex] = index;
                return newOptions;
            });
            // Immediately clear the auto-advance timer when an option is selected
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
        // Calculate correct answers only when all questions are answered
        for (let i = 0; i < questions.length; i++) {
            // Assuming the correct answer index for each question is 0, based on your original logic
            if (selectedOptions[i] === 0) { 
                correctAns++;
            }
        }
        return (
            <MCQDiv>
                <h1>{correctAns} / {questions.length}</h1>
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
                    {questions[currentQuestionIndex].answers.map((ele,ind) => 
                        <li 
                            key={ind} 
                            onClick={() => handleSelectOption(ind)} 
                            className={selectedOptions[currentQuestionIndex] === ind ? 'isSelected' : undefined} 
                        >
                            <p>{ele}</p>
                        </li>
                    )}
                </ul>
            </div>
        </MCQDiv>
    );
}