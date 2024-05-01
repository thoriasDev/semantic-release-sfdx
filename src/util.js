import sfdx from "sfdx-node";

export const getDefaultDevHub = () => {
	return sfdx.force.org.list().then((orgs) => {
		return (
			orgs.nonScratchOrgs?.find((org) => org.isDefaultDevHubUsername)
		);
	});
};

export const getPackage = (project) => {
	return project.packageDirectories.find((dir) => dir.default);
};
