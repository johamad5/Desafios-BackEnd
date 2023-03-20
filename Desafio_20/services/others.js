import os from 'os';

export async function datosServer() {
	const Argumentos = process.argv.slice(2);
	const Plataforma = process.platform;
	const Version = process.version;
	const Memoria = process.memoryUsage().rss;
	const Path = process.execPath;
	const Id = process.pid;
	const Carpeta = process.cwd();
	const numCPUs = os.cpus().length;

	const datos = {
		Argumentos: Argumentos,
		Pltataforma: `Sistema operativo ( SO ) - ${Plataforma}`,
		Version: `Version de Node.js utilizada - ${Version}`,
		Memoria: `Memoria total reservada ( RSS ) - ${Memoria}`,
		Path: `Path de ejecución - ${Path}`,
		CPUs: `Cantidad de procesadores presentes en el servidor - ${numCPUs}`,
		Id: `Process ID - ${Id}`,
		Carpeta: `Carpeta del proyecto - ${Carpeta}`,
	};

	return datos;
}
