import { useEffect, useState } from "react";
import { HardHat } from "lucide-react";
import PropTypes from "prop-types";

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        gün: Math.floor(difference / (1000 * 60 * 60 * 24)),
        saat: Math.floor((difference / (1000 * 60 * 60)) % 24),
        dakika: Math.floor((difference / 1000 / 60) % 60),
        saniye: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== "saniye" && interval !== "dakika") {
      return;
    }
    if (timeLeft[interval] < 0) return;
    timerComponents.push(
      <div key={interval} className="text-center">
        <span className="text-4xl md:text-6xl font-bold">
          {String(timeLeft[interval]).padStart(2, "0")}
        </span>
        <span className="block text-xs md:text-sm uppercase tracking-wider">
          {interval}
        </span>
      </div>
    );
  });

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 my-8">
      {timerComponents.length ? timerComponents : <span>Çok yakında!</span>}
    </div>
  );
};

Countdown.propTypes = {
  targetDate: PropTypes.string.isRequired,
};

function MaintenancePage({ status }) {
  return (
    <div className="bg-gray-900 text-white flex flex-col items-center justify-center h-screen w-screen p-4 text-center">
      <style>
        {`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                .animate-pulse-icon {
                    animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                `}
      </style>
      <HardHat className="w-20 h-20 md:w-24 md:h-24 text-yellow-400 animate-pulse-icon mb-6" />
      <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">
        Sitemiz Bakımda
      </h1>
      <p className="max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed">
        {status.message ||
          "Size daha iyi hizmet verebilmek için kısa bir mola verdik. En kısa sürede geri döneceğiz."}
      </p>
      {status.returnDate && <Countdown targetDate={status.returnDate} />}
      <div className="mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} Deposun - Tüm Hakları Saklıdır.
      </div>
    </div>
  );
}

MaintenancePage.propTypes = {
  status: PropTypes.shape({
    message: PropTypes.string,
    returnDate: PropTypes.string,
  }).isRequired,
};

export default MaintenancePage;
