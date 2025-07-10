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
    }

    & li p{
        font-size : 3vh;
        color : pink;
        //text-align : start;
    }

    & li:hover {
        background-color : orange;
    }

    & li:hover p {
        color : white;
    }

`

export default function MCQ(){
    return (
        <MCQDiv>
            <h3>{questions[0].text}</h3>

            <div className='options'>
                <ul>
                    {questions[0].answers.map((ele) => <li><p>{ele}</p></li>)}
                </ul>
            </div>
        </MCQDiv>
    )
}