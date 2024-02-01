import HomeButton from "../components/HomeButton";
import LogInButton from "../components/AuthButton";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
	return (
		<nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
				<Link href="profile">
					<Button>Profile</Button>
				</Link>
				<HomeButton />
				<LogInButton />
			</div>
		</nav>
	);
}
