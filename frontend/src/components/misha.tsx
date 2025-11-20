
interface MishaProps{
    text: string;
} 

const Misha: React.FC<MishaProps>=({
    text,
}) =>{
    const xyy =() =>{
        console.log('chlen')
    } 
    return(
        <>
            <div className = "text-blue-400">
                {text}
            </div>
            <div >
                <button className="border-2 border-amber-400 w-2xl text-center p-2.5 rounded-xl bg-emerald-100 transition shadow-md hover: shadow-4xl cursor-pointer "  onClick={xyy}>
                chupapimunana
                </button>
            </div>
        </>
    );
};

export default Misha;