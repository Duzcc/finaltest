const diceImages = document.querySelectorAll('.dice img');
const betImages = document.querySelectorAll('.bet img');
const betCounters = document.querySelectorAll('.bet span');
const spinButton = document.querySelector('.spin');
const resetButton = document.querySelector('.reset');
const instructions = document.querySelector('.instructions');
let isSpinning = false;
let betPoints = [0, 0, 0, 0, 0, 0];

function spinDice() {
  if (isSpinning) return; // Nếu đang quay thì không làm gì
  isSpinning = true;

  // Vô hiệu hóa nút và hình
  spinButton.disabled = true;
  resetButton.disabled = true;
  betImages.forEach(img => img.style.pointerEvents = 'none');

  // Mảng chứa các đường dẫn ảnh xúc xắc
  const dicePaths = [
    './img/bau.png',
    './img/cua.png',
    './img/tom.png',
    './img/ca.png',
    './img/huou.png',
    './img/ga.png'
  ];

  // Hiệu ứng trộn ảnh bằng cách thay đổi liên tục
  const spinIntervals = Array.from(diceImages).map(dice =>
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * dicePaths.length);
      dice.src = dicePaths[randomIndex]; // Hiển thị hình ngẫu nhiên
    }, 100)
  );

  // Kết thúc quay sau 3 giây
  setTimeout(() => {
    // Dừng hiệu ứng quay
    spinIntervals.forEach(interval => clearInterval(interval));

    // Gán kết quả cuối cùng
    const finalResults = Array.from(diceImages).map(dice => {
      const randomIndex = Math.floor(Math.random() * dicePaths.length);
      dice.src = dicePaths[randomIndex]; // Hiển thị kết quả cuối
      return randomIndex + 1; // Kết quả từ 1-6
    });

    // Kiểm tra kết quả
    checkResults(finalResults);

    // Kích hoạt lại các nút và hình
    spinButton.disabled = false;
    resetButton.disabled = false;
    betImages.forEach(img => img.style.pointerEvents = 'auto');
    isSpinning = false;
  }, 3000); // Dừng sau 3 giây
}

function placeBet(event) {
  if (isSpinning) return; // Không cho phép đặt cược khi đang quay

  const betImage = event.target;
  const index = Array.from(betImages).indexOf(betImage);

  const totalPoints = betPoints.reduce((sum, points) => sum + points, 0);
  if (totalPoints < 3 && betPoints[index] < 3) { // Tổng điểm cược tối đa là 3
    betPoints[index]++;
    betCounters[index].innerText = betPoints[index];
  }
}

function resetBets() {
  if (isSpinning) return; // Không cho phép reset khi đang quay

  // Đặt lại tất cả điểm cược
  betPoints = [0, 0, 0, 0, 0, 0];
  betCounters.forEach(counter => (counter.innerText = '0'));
}

function checkResults(finalResults) {
  let correct = false;

  // Kiểm tra từng loại cược
  betPoints.forEach((bet, index) => {
    if (bet > 0 && finalResults.includes(index + 1)) {
      correct = true;
    }
  });

  // Cập nhật thông báo kết quả
  if (correct) {
    instructions.innerHTML = `<strong>Bạn đã đoán đúng!</strong> Kết quả: ${finalResults.join(', ')}`;
  } else {
    instructions.innerHTML = `<strong>Bạn đã đoán sai!</strong> Kết quả: ${finalResults.join(', ')}`;
  }
}

// Thêm sự kiện cho nút quay
spinButton.addEventListener('click', spinDice);

// Thêm sự kiện cho nút reset
resetButton.addEventListener('click', resetBets);

// Thêm sự kiện cho các hình ảnh đặt cược
betImages.forEach(img => {
  img.addEventListener('click', placeBet);
});
