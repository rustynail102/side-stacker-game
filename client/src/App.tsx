import "@app/styles/global.css"
import logo from "@app/assets/images/logo.svg"

export const App: React.FC = () => (
  <div className="hero min-h-screen bg-base-200">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <img
          src={logo}
          className="w-28 h-28 block mx-auto mb-4"
          alt="Side-Stacker logo"
        />
        <h1 className="text-5xl font-bold">Side-Stacker</h1>
        <input
          type="text"
          placeholder="Enter your username"
          className="input input-bordered input-primary w-full max-w-xs my-10"
        />
        <button className="btn btn-success">Get Started</button>
      </div>
    </div>
  </div>
)
