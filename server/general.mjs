import fs from "node:fs";

const hasDockerEnv = () => {
    try { 
        fs.statSync("/.dockerenv");
        return true;
    } catch (error) {
        return false;
    }
}

const hasDockerGroup = () => {
    try {
		return fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch(error) {
		return false;
	}
}

export {
    hasDockerEnv,
    hasDockerGroup
}