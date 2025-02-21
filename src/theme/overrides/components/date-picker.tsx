import { Theme } from '@mui/material/styles';
import { buttonClasses } from '@mui/material/Button';
import {
  CalendarToday,
  AccessTime,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
} from '@mui/icons-material';

// ----------------------------------------------------------------------

const dateList = [
  'DatePicker',
  'DateTimePicker',
  'StaticDatePicker',
  'DesktopDatePicker',
  'DesktopDateTimePicker',
  //
  'MobileDatePicker',
  'MobileDateTimePicker',
];

const timeList = ['TimePicker', 'MobileTimePicker', 'StaticTimePicker', 'DesktopTimePicker'];

const switchIcon = () => <KeyboardArrowDown sx={{ width: 24, height: 24 }} />;

const leftIcon = () => <ChevronLeft sx={{ width: 24, height: 24 }} />;

const rightIcon = () => <ChevronRight sx={{ width: 24, height: 24 }} />;

const calendarIcon = () => <CalendarToday sx={{ width: 24, height: 24 }} />;

const clockIcon = () => <AccessTime sx={{ width: 24, height: 24 }} />;

const desktopTypes = dateList.reduce((result: Record<string, any>, currentValue) => {
  result[`Mui${currentValue}`] = {
    defaultProps: {
      slots: {
        openPickerIcon: calendarIcon,
        leftArrowIcon: leftIcon,
        rightArrowIcon: rightIcon,
        switchViewIcon: switchIcon,
      },
    },
  };

  return result;
}, {});

const timeTypes = timeList.reduce((result: Record<string, any>, currentValue) => {
  result[`Mui${currentValue}`] = {
    defaultProps: {
      slots: {
        openPickerIcon: clockIcon,
        rightArrowIcon: rightIcon,
        switchViewIcon: switchIcon,
      },
    },
  };

  return result;
}, {});

export function datePicker(theme: Theme) {
  return {
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          '& .MuiPickersLayout-actionBar': {
            [`& .${buttonClasses.root}:last-of-type`]: {
              backgroundColor: theme.palette.text.primary,
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.common.white
                  : theme.palette.grey[800],
            },
          },
        },
      },
    },

    // Date
    ...desktopTypes,

    // Time
    ...timeTypes,
  };
}
