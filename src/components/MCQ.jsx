import { useState, useEffect, useRef } from 'react';
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
    
    & .options ul li.isSelected {
        background-color : orange;
        color : pink;
    }

    & li:hover {
        background-color : #5D3FD3;
    }

    &  li:hover p {
        color : white;
    }

`

export default function MCQ(){
    

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]); // Stores the index of the selected option for each question
    const [progressVal, setProgressVal] = useState(3000); // Progress for auto-advance
    const [selectProgress, setSelectProgress] = useState(1500);

    const autoAdvanceTimerRef = useRef(null);
    const progressIntervalRef = useRef(null);
    const selectTimerRef = useRef(null);
    const selectProgressIntervalRef = useRef(null);
    



    useEffect(() => {
        if (autoAdvanceTimerRef.current) {
            clearTimeout(autoAdvanceTimerRef.current);
        }

        if(currentQuestionIndex< questions.length){
            autoAdvanceTimerRef.current = setTimeout(() => {
                setCurrentQuestionIndex((prevQ) => prevQ+1)
            }
            ,3000)
    }

        return () =>{
            clearTimeout(autoAdvanceTimerRef.current);
            }
    },[currentQuestionIndex]);




    useEffect(() => {

        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        setProgressVal(3000);

        progressIntervalRef.current = setInterval(() => {
            setProgressVal((prevVal) => {
                if(prevVal <= 0){
                    clearInterval(progressIntervalRef.current)
                    return 0;
                }
                return prevVal -10;
            })
        },10)

        return () => {
            clearInterval(progressIntervalRef.current);
        }
    },[currentQuestionIndex])



    useEffect(() => {
        if(selectTimerRef.current){
            clearTimeout(selectTimerRef.current);
        }
        if(selectProgressIntervalRef.current){
            clearTimeout(selectProgressIntervalRef.current);
        }

        setSelectProgress(1500); 

        if(selectedOptions[currentQuestionIndex] !== undefined){
            selectProgressIntervalRef.current = setInterval(()=>{
                setSelectProgress((prevProgress) => {
                if(prevProgress<=0){
                    clearInterval(selectProgressIntervalRef.current);
                    return 0;
                }
                return prevProgress - 10;
            })
        },10)
        
        selectTimerRef.current = setTimeout(() =>{
            setCurrentQuestionIndex((prevQ) => {
                if (prevQ < questions.length - 1) {
                    return prevQ + 1;
                    }
                return prevQ; 
                });
        },1500)
        }

        return () => {
            clearTimeout(selectTimerRef.current);
            clearInterval(selectProgressIntervalRef.current);
        };

        
    },[currentQuestionIndex,selectedOptions])


    

    function handleSelectOption(index){
       if (selectedOptions[currentQuestionIndex] === undefined) {
        setSelectedOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[currentQuestionIndex] = index;
            return newOptions;
        })
    }

    console.log(selectedOptions);

    
    
}

let correctAns = 0;

    if(currentQuestionIndex >= questions.length){
        return (
            <>
            <MCQDiv>
            {selectedOptions.map((ele) => {
                if(ele === 0){
                    correctAns = correctAns + 1;
                }
            })}
            <h1>{correctAns} / {questions.length - 1}</h1>
            </MCQDiv>
            </>
        )
    }


    return (
        <MCQDiv>
            <progress value={selectedOptions[currentQuestionIndex]?selectProgress:progressVal} max={selectedOptions[currentQuestionIndex]?1500:3000} ></progress>
            <h3>{questions[currentQuestionIndex].text}</h3>

            <div className='options'>
                <ul>
                    {questions[currentQuestionIndex].answers.map((ele,ind) => <li key={ind} onClick={() => handleSelectOption(ind)} className={selectedOptions[currentQuestionIndex] === ind ? 'isSelected' : undefined} ><p>{ele}</p></li>)}
                </ul>
            </div>
            {/* {console.log(options)} */}
        </MCQDiv>
    )
}


