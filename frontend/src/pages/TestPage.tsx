import Dima from "../components/dima";
import Hui from "../components/hui";
import Misha from "../components/misha";
import TestComponent from "../components/TestComponent";

const TestPage = ()  => {
    return (
        <>
            <TestComponent text='test'/>
            <Dima text='i love you'/>
            <TestComponent text='test '/>
            <br />
            <h1>Chlen</h1>
            <br />
            <Misha text='zalupa pashalko 1488'/>
            <Hui/>
        </>
    );
};

export default TestPage;