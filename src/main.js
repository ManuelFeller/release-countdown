import DOMPurify from "dompurify";
import './styles.css';

// Default export
function app() {

  // define functions

  readPurifiedValue = (value) => {
    return DOMPurify.sanitize(value, {
      USE_PROFILES: { html: false, mathMl: false, svg: false },
    });
  } 

  const getCurrentColorMode = () => {
    const currentMode = localStorage.getItem('colorMode');
    if (currentMode === null) {
      // not set yet
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // api is available and set to dark
        return 'dark';
      } else {
        // assume light mode
        return 'light';
      }
    } else {
      return currentMode;
    }
  }

  const toggleColorMode = () => {
    // check for local setting that is already there
    let currentMode = getCurrentColorMode();
    // check main text color to find out what mode is active
    if (currentMode === 'light') {
      // toggle to dark
      setColorMode(true);
      // persist current setting
      localStorage.setItem('colorMode', 'dark')
    } else {
      // toggle to light
      setColorMode(false);
      // persist current setting
      localStorage.setItem('colorMode', 'light')
    }
  }

  const setColorMode = (setToDark) => {
    if (setToDark) {
      // set to dark
      document.documentElement.style.setProperty('--bgGradientStart', 'rgb(12,12,12)');
      document.documentElement.style.setProperty('--bgGradientEnd', 'rgb(34,34,34)');
      document.documentElement.style.setProperty('--mainTextColor', '#bbb');
      document.documentElement.style.setProperty('--cntElementBackground', '#222');
      document.documentElement.style.setProperty('--cntNumberTextColor', '#fff');
      document.documentElement.style.setProperty('--btnBackgroundColor', 'rgb(10,10,10)');
      document.documentElement.style.setProperty('--btnDisabledTextColor', '#444');
      document.documentElement.style.setProperty('--logoManuColor', '#aaa');
    } else {
      // set to light
      document.documentElement.style.setProperty('--bgGradientStart', 'rgb(234,234,234)');
      document.documentElement.style.setProperty('--bgGradientEnd', 'rgb(210,210,210)');
      document.documentElement.style.setProperty('--mainTextColor', '#333');
      document.documentElement.style.setProperty('--cntElementBackground', '#eee');
      document.documentElement.style.setProperty('--cntNumberTextColor', '#fff');
      document.documentElement.style.setProperty('--btnBackgroundColor', '#ddd');
      document.documentElement.style.setProperty('--btnDisabledTextColor', '#888');
      document.documentElement.style.setProperty('--logoManuColor', '#000');
    }
  }

  const getEmptyConfigObject = () => {
    return {
      project: 'next release',
      doneMsg: 'Get it out!',
      year: new Date().getYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      minute: 0,
    }
  }

  const addLeadingZeroIfNeeded = (value) => {
    if (value < 10) {
      return '0'.concat(value);
    } else {
      return value;
    }
  }

  const setConfigFromUrl = (url) => {
    let newConfig = getEmptyConfigObject();


    // project name
    let projName = url.searchParams.get('p');
    if (projName !== null) {
      newConfig.project = readPurifiedValue(projName);
    }

    let cntDoneMessage = url.searchParams.get('msg');
    if (cntDoneMessage !== null) {
      newConfig.doneMsg = readPurifiedValue(cntDoneMessage);
    }

    let year = url.searchParams.get('y');
    if (year !== null) {
      newConfig.year = readPurifiedValue(year);
    }

    let month = url.searchParams.get('m');
    if (month !== null) {
      newConfig.month = readPurifiedValue(month);
    }

    let day = url.searchParams.get('d');
    if (day !== null) {
      newConfig.day = readPurifiedValue(day);
    }

    let hour = url.searchParams.get('h');
    if (hour !== null) {
      newConfig.hour = readPurifiedValue(hour);
    }

    let minute = url.searchParams.get('min');
    if (minute !== null) {
      newConfig.minute = readPurifiedValue(minute);
    }

    // save new time for deadline
    localStorage.setItem('config', JSON.stringify(newConfig));
    // remove set command from the url box
    window.location.href = window.location.origin.concat(window.location.pathname);
  }

  const stopFinishedAnimations = () => {
    document.getElementById("day").classList.remove('numbersRotationA');
    document.getElementById("hour").classList.remove('numbersRotationB');
    document.getElementById("minute").classList.remove('numbersRotationA');
    document.getElementById("second").classList.remove('numbersRotationB');
    document.getElementById("doneMessage").classList.remove('textPulsing');
  }

  const startFinishedAnimations = () => {
    document.getElementById("day").classList.add('numbersRotationA');
    document.getElementById("hour").classList.add('numbersRotationB');
    document.getElementById("minute").classList.add('numbersRotationA');
    document.getElementById("second").classList.add('numbersRotationB');
    document.getElementById("doneMessage").classList.add('textPulsing');
  }

  const initSetupUi = () => {
    stopFinishedAnimations();
    // check if there is a config we can return to
    let savedConfig = localStorage.getItem('config');
    if (savedConfig === null) { // no saved config yet
      // disable the back button
      document.getElementById("cancelConfig").disabled = true;
    } else {
      // load current target time
      document.getElementById("cancelConfig").disabled = false;
      const tmpConfig = JSON.parse(savedConfig);
      // generate date from UTC time setting
      const tmpDate = new Date(Date.UTC(tmpConfig.year, (tmpConfig.month - 1), tmpConfig.day, tmpConfig.hour, tmpConfig.minute));
      document.getElementById("cntname").value = tmpConfig.project;
      document.getElementById("cntdone").value = tmpConfig.doneMsg;
      // enter date adjusted to local timezone
      document.getElementById("cntdate").value = ''.concat(tmpDate.getFullYear(), '-', addLeadingZeroIfNeeded(tmpDate.getMonth() + 1), '-', addLeadingZeroIfNeeded(tmpDate.getDate()));
      document.getElementById("cnttime").value = ''.concat(addLeadingZeroIfNeeded(tmpDate.getHours()), ':', addLeadingZeroIfNeeded(tmpDate.getMinutes()));
    }
    // make sure countdown UI is hidden
    document.getElementById("countdown").style.display = 'none';
    // get date of today
    const isYear = new Date().getFullYear();
    const isMonth = addLeadingZeroIfNeeded(new Date().getUTCMonth() + 1);
    const isDay = addLeadingZeroIfNeeded(new Date().getDate());
    // set min date for the UI
    document.getElementById("cntdate").min = ''.concat(isYear, '-', isMonth, '-', isDay);
    // show UI
    document.getElementById("setup").style.display = null;
  }

  const closeSetupUi = () => {
    stopFinishedAnimations();
    document.getElementById("setup").style.display = 'none';
    document.getElementById("countdown").style.display = null;
  }

  const saveAndApplyConfig = () => {
    let errors = '';
    // read input fields
    const projectNameValue = readPurifiedValue(document.getElementById("cntname").value);
    const finishedTextValue = readPurifiedValue(document.getElementById("cntdone").value);
    const deadlineDateValue = readPurifiedValue(document.getElementById("cntdate").value);
    const deadlineTimeValue = readPurifiedValue(document.getElementById("cnttime").value);
    // init missing check
    let hasMissing = false;
    let tempTestConfig = getEmptyConfigObject();
    if (deadlineDateValue !== '') {
      const dateCheck = deadlineDateValue.match(/^\d{4}[./-]\d{2}[./-]\d{2}$/);
      if (dateCheck === null) {
        hasMissing = true;
        // add error text
        errors += '\n- wrong date format (use yyyy-mm-dd)';
      }
      else {
        // split date
        const dateParts = deadlineDateValue.split('-');
        // save date in config
        tempTestConfig.year = parseInt(dateParts[0]);
        tempTestConfig.month = parseInt(dateParts[1]);
        tempTestConfig.day = parseInt(dateParts[2]);
      }
    } else {
      hasMissing = true;
      // add error text
      errors += '\n- missing date';
    }

    if (deadlineTimeValue !== '') {
      const timeCheck = deadlineTimeValue.match(/^\d{2}[./:]\d{2}$/);
      if (timeCheck === null) {
        hasMissing = true;
        // add error text
        errors += '\n- wrong time format (use hh:mm)';
      } else {
        // split time
        const timeParts = deadlineTimeValue.split(':');
        // save time in config
        tempTestConfig.hour = parseInt(timeParts[0]);
        tempTestConfig.minute = parseInt(timeParts[1]);
      }
    } else {
      hasMissing = true;
      // add error text
      errors += '\n- missing time';
    }
    // if no error yet check if input can be combined to a valid date
    if (!hasMissing) {
      try {
        // tetsing for a valid date
        const testDate = new Date(Date.UTC(tempTestConfig.year, (tempTestConfig.month - 1), tempTestConfig.day, tempTestConfig.hour, tempTestConfig.minute));
        if (testDate.getUTCFullYear() != tempTestConfig.year
            || testDate.getUTCMonth() != (tempTestConfig.month - 1)
            || testDate.getUTCDate() != tempTestConfig.day
            || testDate.getUTCHours() != tempTestConfig.hour
            || testDate.getUTCMinutes() != tempTestConfig.minute
            ) { // date is not matching with what was entered by the user, so it is invalid (even if it may have been converted)
              hasMissing = true;
              // add error text
              errors += '\n- the input is not a valid date or time...';
        } else {
          // check if date is in the future
          console.log(new Date());
          console.log(testDate);
          if ((new Date()) >= testDate) {
            hasMissing = true;
              // add error text
              errors += '\n- the new countdown target time needs to be in the future...';
          }
        }
      } catch (err) {
        hasMissing = true;
        // add error text
        errors += '\n- the input is not a valid date or time...';
      }
    }

    // all data that is needed is available
    if (!hasMissing) {
      // optional values
      if (projectNameValue.trim() !== '') {
        tempTestConfig.project = projectNameValue;
      }
      if (finishedTextValue.trim() !== '') {
        tempTestConfig.doneMsg = finishedTextValue;
      }
      // do timezone conversion (create date form based on current timezone)
      const convertDate = new Date(tempTestConfig.year, (tempTestConfig.month - 1), tempTestConfig.day, tempTestConfig.hour, tempTestConfig.minute);
      const newConfig = getEmptyConfigObject();
      newConfig.project = tempTestConfig.project;
      newConfig.doneMsg = tempTestConfig.doneMsg;
      newConfig.year = convertDate.getUTCFullYear();
      newConfig.month = convertDate.getUTCMonth() + 1;
      newConfig.day = convertDate.getUTCDate();
      newConfig.hour = convertDate.getUTCHours();
      newConfig.minute = convertDate.getUTCMinutes();
      // save config
      localStorage.setItem('config', JSON.stringify(newConfig));
      // delete old timer
      clearInterval(intervalReference);
      // switch to countdown view
      document.getElementById("setup").style.display = 'none';
      startCountdown(newConfig);
    } else {
      alert('Invalid or missing inputs:' + errors);
    }
  }

  const startCountdown = (configObject) => {
    stopFinishedAnimations();
    document.getElementById("projectname").innerHTML = readPurifiedValue(configObject.project);
    document.getElementById("doneMessage").style.visibility = 'hidden';
    document.getElementById("doneMessage").innerHTML = readPurifiedValue(configObject.doneMsg);
    document.getElementById("countdown").style.display = null;
    const deadline = new Date(Date.UTC(configObject.year, (configObject.month - 1), configObject.day, configObject.hour, configObject.minute)).getTime();
    intervalReference = setInterval(function() {
      let now = new Date().getTime();
      let t = deadline - now;
      let days = Math.floor(t / (1000 * 60 * 60 * 24));
      let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((t % (1000 * 60)) / 1000);
      document.getElementById("day").innerHTML = readPurifiedValue(days) ;
      document.getElementById("hour").innerHTML = readPurifiedValue(hours);
      document.getElementById("minute").innerHTML = readPurifiedValue(minutes);
      document.getElementById("second").innerHTML = readPurifiedValue(seconds);
      if (t <= 0) {
        clearInterval(intervalReference);
        document.getElementById("doneMessage").style.visibility = 'visible';
        document.getElementById("day").innerHTML ='0';
        document.getElementById("hour").innerHTML ='0';
        document.getElementById("minute").innerHTML ='0';
        document.getElementById("second").innerHTML = '0';
        startFinishedAnimations();
      }
    }, 500);
  }

  const newCountdown = () => {
    document.getElementById("countdown").style.display = 'none';
    initSetupUi();
  }

  const shareCountdown = () => {
    const savedConfig = localStorage.getItem('config');
    if (savedConfig === null) {
      alert("There is no configured Countdown to share...");
    } else {
      const pageUrl = new URL(window.location);
      const configObject = JSON.parse(savedConfig);
      const shareUrl = window.location.origin.concat(
        window.location.pathname,
        '?a=set&',
        '&y=',
        encodeURIComponent(configObject.year),
        '&m=',
        encodeURIComponent(configObject.month),
        '&d=',
        encodeURIComponent(configObject.day),
        '&h=',
        encodeURIComponent(configObject.hour),
        '&min=',
        encodeURIComponent(configObject.minute),
        '&p=',
        encodeURIComponent(configObject.project),
        '&msg=',
        encodeURIComponent(configObject.doneMsg)
      );
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          alert('Share URL copied to clipboard...');
        })
        .catch(err => {
          alert('Error copying share URL to the clipboard: ', err);
        });
    }
  }

  // the actual script execution

  // check if there is a preferred theme configured and set it
  if (getCurrentColorMode() === 'dark') {
    setColorMode(true);
  } else {
    setColorMode(false);
  }
  // init the only global element, the reference to the interval function
  var intervalReference = null;
  // hide both main UI views
  document.getElementById("countdown").style.display = 'none';
  document.getElementById("setup").style.display = 'none';
  // init - bind the buttons to their functions
  document.getElementById("themeToggle").addEventListener('click', toggleColorMode);
  document.getElementById("setConfig").addEventListener('click', saveAndApplyConfig);
  document.getElementById("cancelConfig").addEventListener('click', closeSetupUi);
  document.getElementById("restart").addEventListener('click', newCountdown);
  document.getElementById("share").addEventListener('click', shareCountdown);

  // check if we should set the countdown config from a share URL
  let url = new URL(window.location);
  if (url.searchParams.get('a') === 'set') {
    // we have a share URL to apply, so let's do so
    setConfigFromUrl(url);
  } else { // regular execution without share URL
    // (try to) load from local storage
    let savedConfig = localStorage.getItem('config');
    if (savedConfig === null) {
      // load the configuration UI
      initSetupUi();
    } else {
      // start the countdown based on the configuration
      startCountdown(JSON.parse(savedConfig));
    }
  }

};

var sNode = document.createElement("script");
sNode.appendChild(app()); 

document.body.appendChild(sNode);