import quiz from '../assets/quiz-logo.png'
import {styled} from 'styled-components';

const HeaderDiv = styled.header`
text-align : center;
border : 1px solid white;


& img {
    height : 7vh;
}

& h1 {
    color : white;
    font-size : 6vh;
    letter-spacing : 0.5vw;
    margin-top : 0px;
}


`

export default function Header(){
    return (
        <>
        <HeaderDiv>
            <img src={quiz} alt="quiz-start-logo" />
            <h1>REACT QUIZ</h1>
        </HeaderDiv>
        </>
    )
}