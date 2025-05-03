export default function Comments(){
    return(<>
      <div className="w-full h-[200px] flex gap-4 p-5 ">
        <div className="w-[10rem] h-[8rem] bg-white flex flex-col items-center gap-3 p-5 shadow-2xl rounded-3xl">
          <span className="font-bold text-sm">All Comments</span>
          <span className="font-bold text-2xl">100K</span>
        </div>
        <div className="w-[10rem] h-[8rem] bg-white flex flex-col items-center gap-3 p-5 shadow-2xl rounded-3xl">
          <span className="font-bold text-sm">Pending Posts</span>
          <span className="font-bold text-2xl">1k</span>
        </div>
        <div className="w-[10rem] h-[8rem] bg-white flex flex-col items-center gap-3 p-5 shadow-2xl rounded-3xl">
          <span className="font-bold text-sm">Suspend Posts</span>
          <span className="font-bold text-2xl">1k</span>
        </div>
      </div>

    </>)
}