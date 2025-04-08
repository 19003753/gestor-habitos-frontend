export default function ProgressBar({ progress }: { progress: number }) {
    const getColor = (progress: number) => {
        if (progress < 20) return "bg-red-500";
        if (progress < 50) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="w-full bg-gray-300 rounded-full h-4 mt-1 overflow-hidden">
            <div className={`${getColor(progress)} h-full transition-all`} style={{ width: `${progress}%` }}></div>
        </div>
    );
}