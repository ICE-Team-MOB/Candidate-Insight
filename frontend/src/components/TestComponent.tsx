interface TestComponentProps {
    text: string;
}

const TestComponent: React.FC<TestComponentProps> = ({
    text,
}) => {
    return (
        <>{text}</>
    );
};

export default TestComponent;