let testSafety = (allData) => {
  // Takes an array of strings, and tests each against the sanitizing regex
  var regex = new RegExp('\[a-zA-Z0-9!@#$%^&*()=_+;:.,?/-]');
  let passing = true;
  for (let i = 0; i < allData.length; i++) {
    let string = allData[i];
    if (string === null || string.length === 0) return true;
    for (let j = 0; j < string.length; j++) {
      let letter = string[j];
      passing = passing && regex.test(letter);
      if (!passing) {
        console.log('THIS FAILED SAFETY', string[j]);
        return false;
      }
    }
  }
  return passing;
}



module.exports = testSafety;