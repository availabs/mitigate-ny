export const EARLIEST_YEAR = 1953;
export const LATEST_YEAR = 2018;

const YEARS_OF_FEMA_DISASTER_DECLARATIONS_DATA = [];
for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
	YEARS_OF_FEMA_DISASTER_DECLARATIONS_DATA.push(year);
}
export { YEARS_OF_FEMA_DISASTER_DECLARATIONS_DATA };