import { Link } from "react-router-dom";

const About = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">About Page</h1>
        <div className="flex flex-col items-start mt-4">
            <p className="text-2xl">This app is built for you to use the pomodoro method to aid in productivity!</p>
            <p className="text-2xl">You choose the length of a focus session, or Pomodoro, and then you take a short break.</p>
            <p className="text-2xl">After a set number of Pomodoros, you take a longer break.</p>
            <p className="text-2xl">You can change the Pomodoro settings on the sidebar on the <Link to="/" className="text-blue-700 hover:text-gray-300">home page</Link> or <Link to="/settings" className="text-blue-700 hover:text-gray-300">here.</Link></p>
            <p className="text-2xl">This app is built with React and Tailwind CSS.</p>
        </div>
        
      </div>
    );
  };
  
  export default About;