const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

let data = null;

const port = new SerialPort({
	baudRate: 9600,
	path: "/dev/cu.usbmodem101",
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// parser.read

export default async (req, res) => {
	data = await parser.read();
	console.log("data in export default function: ", data);
	res.status(200).send(`${data}`);
};
