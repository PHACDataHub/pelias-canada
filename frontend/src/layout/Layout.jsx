import { Outlet } from "react-router-dom"
import { GcdsHeader, GcdsContainer } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css"
import Breadcrumb from "../components/Breadcrumb"
import "./Layout.css"
import TopNav from "./TopNav"
import Footer from "./Footer"

export default function Layout() {
	return (
		<>
			<GcdsHeader skipToHref="#main-content" padding="150px" height="auto">
				<div slot="skip-to-nav">
					<a className="skip-to-content-link" href="#main-content">
						Skip to main content
					</a>
				</div>
				<nav slot="menu" style={{ backgroundColor: "#f1f2f3" }}>
					<GcdsContainer size="xl" centered color="black">
						<TopNav />
					</GcdsContainer>
				</nav>
			</GcdsHeader>

			<GcdsContainer
				size="xl"
				centered
				color="black"
				style={{
					flexGrow: "1",
				}}
				padding="400"
				id="main-content"
			>
				<Breadcrumb />
				<Outlet />
			</GcdsContainer>

			<Footer />
		</>
	)
}
