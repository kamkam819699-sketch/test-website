(() => {
  const subjectList = document.getElementById('subjectList');
  const rowTemplate = document.getElementById('rowTemplate');
  const addRowBtn = document.getElementById('addRow');
  const resetBtn = document.getElementById('resetBtn');

  const gpaValueEl = document.getElementById('gpaValue');
  const totalCreditsEl = document.getElementById('totalCredits');
  const totalSubjectsEl = document.getElementById('totalSubjects');
  const feedbackEl = document.getElementById('feedbackMsg');
  const ringFg = document.getElementById('ringFg');

  const RING_CIRCUMFERENCE = 2 * Math.PI * 68; // matches r=68 in the SVG

  const feedbackByGpa = [
    { min: 3.5, msg: 'ยอดเยี่ยมมาก! เกรดสวยขนาดนี้ 🌟' },
    { min: 3.0, msg: 'เก่งมาก รักษามาตรฐานแบบนี้ไว้นะ 💪' },
    { min: 2.5, msg: 'มาได้สวยเลย ลองดันอีกนิดก็ดีเยี่ยม 🌱' },
    { min: 2.0, msg: 'พอไหว ค่อย ๆ ปรับกันต่อไปได้ 🙂' },
    { min: 0,   msg: 'ยังไม่สายที่จะเริ่มตั้งใจใหม่ สู้ ๆ นะ 🤍' },
  ];

  function createRow() {
    const fragment = rowTemplate.content.cloneNode(true);
    const row = fragment.querySelector('.subject-row');
    subjectList.appendChild(row);
    bindRow(row);
    calculate();
  }

  function bindRow(row) {
    row.querySelectorAll('.credit-input, .grade-select').forEach((el) => {
      el.addEventListener('input', calculate);
      el.addEventListener('change', calculate);
    });
    row.querySelector('.btn-remove').addEventListener('click', () => {
      row.remove();
      calculate();
    });
  }

  function calculate() {
    const rows = Array.from(subjectList.querySelectorAll('.subject-row'));
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach((row) => {
      const credit = parseFloat(row.querySelector('.credit-input').value) || 0;
      const grade = parseFloat(row.querySelector('.grade-select').value) || 0;
      totalCredits += credit;
      totalPoints += credit * grade;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    gpaValueEl.textContent = gpa.toFixed(2);
    totalCreditsEl.textContent = totalCredits % 1 === 0 ? totalCredits : totalCredits.toFixed(1);
    totalSubjectsEl.textContent = rows.length;

    const ratio = Math.max(0, Math.min(gpa / 4, 1));
    const offset = RING_CIRCUMFERENCE * (1 - ratio);
    ringFg.style.strokeDashoffset = offset;

    if (rows.length === 0 || totalCredits === 0) {
      feedbackEl.textContent = 'เริ่มกรอกรายวิชาทางซ้ายได้เลย ✨';
    } else {
      const tier = feedbackByGpa.find((t) => gpa >= t.min);
      feedbackEl.textContent = tier.msg;
    }
  }

  addRowBtn.addEventListener('click', createRow);

  resetBtn.addEventListener('click', () => {
    subjectList.innerHTML = '';
    createRow();
    createRow();
    createRow();
  });

  // seed with a few starter rows
  createRow();
  createRow();
  createRow();
})();