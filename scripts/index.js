function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const loadWordLevel = (id) => {
  spinnerHandler(true);
  const allLessonBtn = document.querySelectorAll(".lesson-btn-common");
  allLessonBtn.forEach((eachbtn) => {
    eachbtn.classList.remove("active");
  });

  const lessonBtn = document.getElementById(`lesson-button-${id}`);
  lessonBtn.classList.add("active");

  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((response) => response.json())
    .then((json) => displayWordLevel(json.data));
};

const displayWordLevel = (words) => {
  const wordContainerSection = document.getElementById(
    "word-container-section"
  );
  wordContainerSection.innerHTML = "";

  if (words.length === 0) {
    wordContainerSection.innerHTML = `
   <div class="text-center col-span-full p-5 space-y-4 mx-auto">
            <img class="mx-auto" src="./assets/alert-error.png" alt="">
            <h1 class="font-bangla text-lg text-[#79716B]">অন্য একটি Lesson Select করুন</h1>
            <p class="font-bangla text-4xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
    </div>
    `;
    spinnerHandler(false);
    return;
  }

  words.forEach((word) => {
    const wordCard = document.createElement("div");

    wordCard.innerHTML = `
        <div class="bg-white rounded-lg p-4 space-y-6">
            <div class="space-y-3">
                <p class="text-xl font-bold">${
                  word.word ? word.word : "ওয়ার্ড খুঁজে পাওয়া যায়নি"
                }</p>
                <p class="text-xl font-medium">Meaning /Pronounciation</p>
                <p class="text-lg font-medium">"${
                  word.meaning ? word.meaning : "অর্থ খুঁজে পাওয়া যায়নি"
                } / ${
      word.pronunciation ? word.pronunciation : "উচ্চারণ খুঁজে পাওয়া যায়নি"
    }"</p>
            </div>
            <div class="flex justify-between">

                <button onclick="loadWordDetails(${
                  word.id
                })" class="bg-[#1A91FF10] w-[35px] h-[35px] rounded-xl hover:bg-[#1A91FF90] cursor-pointer"><i class="fa-solid fa-circle-question"></i></button>

                <button onclick="pronounceWord('${
                  word.word
                }')" class="bg-[#1A91FF10] w-[35px] h-[35px] rounded-xl hover:bg-[#1A91FF90] cursor-pointer"><i class="fa-solid fa-volume-high"></i></button>

            </div>
        </div>
        `;
    wordContainerSection.appendChild(wordCard);
    spinnerHandler(false);
  });
};

const displayDetailsOnModal = (word) => {
  const wordDetailsContainer = document.getElementById(
    "word-details-container"
  );
  wordDetailsContainer.innerHTML = "";

  const wordDetails = document.createElement("div");
  wordDetails.innerHTML = `
    <div class="border-2 border-[#EDF7FF] px-6 py-3 rounded-xl">
                    <div class="space-y-4 mb-6">
                        <h1 class="font-bold text-xl">${
                          word.word
                        }(<i class="fa-solid fa-microphone-lines"></i> : ${
    word.pronunciation
  })</h1>
                        <h3 class="font-semibold text-lg">Meaning</h3>
                        <p class="font-medium text-base">${word.meaning}</p>
                    </div>
                    <div class="space-y-2 mb-6">
                        <h3 class="font-semibold text-lg">Example</h3>
                        <p class="font-medium text-base">${word.sentence}</p>
                    </div>
                    <div class="space-y-2 mb-">
                        <h3 class="font-semibold text-lg">সমার্থক শব্দ গুলো</h3>
                        <div class="grid grid-cols-1 md:flex justify-start gap-5">
                           ${displaySynonyms(word.synonyms)}
                        </div>
                    </div>
    </div>
    `;
  wordDetailsContainer.appendChild(wordDetails);
  my_modal.showModal();
};

const displaySynonyms = (synonyms) => {
  const returnElementArray = synonyms.map((element) => {
    return `<p class="bg-sky-100 p-3 font-medium rounded-xl w-fit">${element}</p>`;
  });
  return returnElementArray.join(" ");
};

const loadWordDetails = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => displayDetailsOnModal(json.data));
};

const loadLessonData = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";

  fetch(url)
    .then((response) => response.json())
    .then((json) => displayLessonData(json.data));
};

const displayLessonData = (lessonData) => {
  const lessonButtonContainer = document.getElementById(
    "lesson-button-container"
  );
  lessonButtonContainer.innerHTML = "";

  lessonData.forEach((eachLesson) => {
    const createLessonDiv = document.createElement("div");
    createLessonDiv.innerHTML = `
        <div>
                <button onclick="loadWordLevel(${eachLesson.level_no})" id="lesson-button-${eachLesson.level_no}" class="btn btn-outline btn-primary lesson-btn-common"><i class="fa-solid fa-book-open"></i>Lesson - ${eachLesson.level_no}</button>
        </div>
        `;
    lessonButtonContainer.appendChild(createLessonDiv);
  });
};

loadLessonData();

const spinnerHandler = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container-section").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document
      .getElementById("word-container-section")
      .classList.remove("hidden");
  }
};

document.getElementById("search-btn").addEventListener("click", () => {
  const inputFieldValue = document
    .getElementById("input-search")
    .value.trim()
    .toLowerCase();
  if (inputFieldValue === "") {
    alert("Input must be filled with some word.");
    return;
  }

  const url = "https://openapi.programming-hero.com/api/words/all";
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const allLessonBtn = document.querySelectorAll(".lesson-btn-common");
      allLessonBtn.forEach((eachbtn) => {
        eachbtn.classList.remove("active");
      });

      const data = json.data;
      const matchedData = data.filter((eachData) => {
        return eachData.word.toLowerCase().includes(inputFieldValue);
      });

      if (matchedData.length === 0) {
        const wordContainerSection = document.getElementById(
          "word-container-section"
        );
        wordContainerSection.innerHTML = "";

        wordContainerSection.innerHTML = `
        <div class="col-span-full text-center">
        <p class="font-bangla text-4xl">আপনার ওয়ার্ড টি খুঁজে পাওয়া যায়নি</p>
        </div>
        `;
        return;
      } else {
        displayWordLevel(matchedData);
      }
    });
});
