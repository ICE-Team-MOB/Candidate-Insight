interface DimaProps {

    text: string;
}

const Dima: React.FC<DimaProps>=({
    text,
}) => {
    const xyy = () => {

        console.log ('lol')
    }
    return (

        <>
            <div className="text-purple-700">
                {text}
            </div>

            <div>
                <button 
                onClick={xyy}

                className="border border-amber-500 p-2.5 m-5 rounded-3xl bg-blue-300 shadow-md hover:shadow-2xl cursor-pointer"
                >
                    
                </button>
            </div>
        </>
    );
};

export default Dima;