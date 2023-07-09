import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import IonSearchbar from "../components/IonSearchbar";

export default function Home() {
	const [data, setData] = useState([]);
	const [enable, setEnable] = useState(false);

	const fetchSerialPort = async () => {
		try {
			const res = await fetch("/api/serialPort");
			// console.log("res", res);
			if (!res.ok) {
				throw new Error(res.status);
			}
			const newData = await res.text();
			const dataArray = JSON.parse(newData);
			console.log("data", dataArray);
			if (dataArray.length > 0) {
				setData(dataArray);
			}
		} catch (error) {
			console.log(
				"An error occurred while fetching the serialPort value: ",
				error
			);
		}
	};

	useEffect(() => {
		let intervalId; // Declare an intervalId

		if (enable) {
			intervalId = setInterval(() => {
				fetchSerialPort();
			}, 50);
		}

		return () => {
			if (intervalId) clearInterval(intervalId); // If an interval was set, clear it
			// setEnable(false); // this line is not needed and might cause problems
		};
	}, [enable, fetchSerialPort]);

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>Radar</ion-title>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">Radar</ion-title>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					<ion-item>
						<ion-label>{enable ? "Enabled" : "disabled"}</ion-label>
						<ion-toggle
							onClick={(e) => setEnable((prev) => !prev)}
						/>
					</ion-item>
				</ion-list>

				<p>Distance: {data.length > 0 ? `${data[0]}` : "Loading..."}</p>
				<p>Angle: {data.length > 0 ? `${data[1]}°` : "Loading..."}</p>

				<RadarContainer>
					{data && (
						<SweepContainer
							style={{
								transform: data
									? `rotate(${data[1] - 90}deg)`
									: "",
							}}
							top={(data[0] / 1023) * 100 + 'px'}
						/>
					)}
				</RadarContainer>

				{/* <ion-button
					onClick={async () => {
						fetchSerialPort();
					}}
				>
					Fetch
				</ion-button> */}
			</ion-content>
		</>
	);
}

const RadarContainer = styled.div`
	position: absolute;
	overflow: hidden;
	top: 50%;
	left: 50%;
	margin: -117px;
	width: 248px;
	height: 248px;
	border-radius: 50%;
	box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.5),
		inset 0 0 0 1px hsla(0, 0%, 100%, 0.15);
	background: repeating-radial-gradient(
			transparent,
			transparent 23px,
			#287a33 25px,
			#287a33 27px
		),
		linear-gradient(
				transparent 49.75%,
				#0e4c42 49.75%,
				#0e4c42 50.25%,
				transparent 50.25%
			)
			50% no-repeat,
		linear-gradient(
				90deg,
				transparent 49.75%,
				#0e4c42 49.75%,
				#0e4c42 50.25%,
				transparent 50.25%
			)
			50% no-repeat,
		linear-gradient(#333, #111);
	background-size: 100%, 218px 218px, 218px 218px, 100%;
	// scale to 1.5
	transform: scale(1.5);
`;

const SweepAnimation = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SweepContainer = styled.div`
	position: absolute;
	box-sizing: border-box;
	top: 16px;
	left: 16px;
	border-right: solid 1px hsla(145, 50%, 40%, 0.3);
	width: 108px;
	height: 108px;
	border-radius: 100% 0 0 0;
	transform-origin: 100% 100%;
	background: linear-gradient(
		50deg,
		rgba(34, 34, 34, 0) 56%,
		hsla(145, 50%, 40%, 1)
	);
	/* background: #f00a; */
	/* animation: ${SweepAnimation} 5s infinite linear; */

	//point 
	&::after {
		content: "";
		position: absolute;
		// top is a prop
		top: ${(props) => props.top || "0"};
		right: 0;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		/* background: #1be350; */
		// #1be350; gradient
		background: radial-gradient(
			ellipse at center,
			#1be350ff 0%,
			#1be35055 100%,
			rgba(0, 0, 0, 01) 100%
		);
		z-index: 999;
	}
`;
