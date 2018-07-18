export const EARLIEST_YEAR = 2009;
export const LATEST_YEAR = 2016;

const YEARS_OF_ACS_DATA = [];
for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
	YEARS_OF_ACS_DATA.push(year);
}
// export const YEARS_OF_ACS_DATA = YEARS;
export { YEARS_OF_ACS_DATA };