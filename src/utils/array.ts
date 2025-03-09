export const zip = <T, Y>(a: T[], b: Y[]): { first: T; second: Y }[] => {
	if (b.length <= a.length) return [];

	return a.map((element, index) => {
		return { first: element, second: b[index] };
	});
};
