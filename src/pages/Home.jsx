import Navbar from "../components/Navbar";
import Button from "../components/Buttons";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight max-w-3xl mb-6">
          Seamless support, <br />
          Smarter Resolutions
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-10">
          Enhance customer service efficiency and resolve issues faster with our
          AI-powered support platform. Streamline communication, automate
          responses, and delight your customers at every interaction
        </p>

        <Button variant="filled" size="big">
          Open a ticket
        </Button>
      </main>
      <footer className="py-4 text-center text-sm text-primary border-t border-gray-200">
        Project by Team 2
      </footer>
    </div>
  );
}

export default Home;
