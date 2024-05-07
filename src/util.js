import sfdx from "sfdx-node";

export const getDefaultDevHub = () => {
	return sfdx.force.org.list().then((orgs) => {
		return (
			orgs.nonScratchOrgs?.find((org) => org.isDefaultDevHubUsername)
		);
	});
};

export const getPackage = (project) => {
	const defaultPackage = project.packageDirectories.find((dir) => dir.default);

    if (!defaultPackage) {
        throw new Error("No default package found in sfdx-project.json");
    }

    return defaultPackage;
};

export const removeUndefined = (obj) => {
    const newObj = {};

    Object.keys(obj).forEach(key => {
        if (obj[key] !== undefined) {
            newObj[key] = obj[key];
        }
    });

    return newObj;
}
