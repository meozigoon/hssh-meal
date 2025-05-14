const dateInput = document.getElementById('meal-date');

dateInput.addEventListener('change', () => {
    const selectedDate = new Date(dateInput.value);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;

    const apiKey = 'b9051bf44db6484e8e82f71c8c422100';
    const proxy = 'https://corsproxy.io/?';
    const url = proxy + encodeURIComponent(
        `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=B10&SD_SCHUL_CODE=7010115&MLSV_YMD=${dateString}&Type=json&Key=${apiKey}`
    );

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const meals = {
                1: 'breakfast',
                2: 'lunch',
                3: 'dinner'
            };

            // 기본값 초기화
            for (const key of Object.values(meals)) {
                document.getElementById(key).innerHTML = '없음';
            }

            const mealData = data?.mealServiceDietInfo?.[1]?.row || [];

            for (const meal of mealData) {
                const mealType = parseInt(meal.MMEAL_SC_CODE);
                const rawContent = meal.DDISH_NM;

                const formattedContent = rawContent
                    .split(/<br\s*\/?>/gi)
                    .map(line => {
                        return line.replace(
                            /\(([\d.]+)\)/g,
                            '<span class="allergy">($1)</span>'
                        );
                    })
                    .join('<br>');

                const elementId = meals[mealType];
                if (elementId) {
                    document.getElementById(elementId).innerHTML = formattedContent;
                }
            }
        })
        .catch(error => {
            console.error('급식 정보 불러오기 실패:', error);
            for (const key of ['breakfast', 'lunch', 'dinner']) {
                document.getElementById(key).innerHTML = '오류 발생';
            }
        });
});
