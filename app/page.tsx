import HomeButton from "../components/HomeButton";
import AuthButton from "../components/AuthButton";

export default async function Index() {
	return (
		<div className="flex-1 w-full flex flex-col gap-20 items-center">
			<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
				<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
					<HomeButton />
					<AuthButton />
				</div>
			</nav>

			<div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
				ciao
			</div>

			<footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
				<p>
					Made whit <b>&lt;3</b> by{" "}
					<a
						href="https://github.com/KovD3v"
						target="_blank"
						className="font-bold hover:underline"
						rel="noreferrer">
						Tommaso Coviello
					</a>
					{' '}&amp;&amp;{' '}
					<a
						href="https://github.com/DuPont9029"
						target="_blank"
						className="font-bold hover:underline"
						rel="noreferrer">
						David Novelli
					</a>
				</p>
			</footer>
		</div>
	);
}