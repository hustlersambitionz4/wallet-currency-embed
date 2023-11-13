const API_ENDPOINT = 'https://bitpay.com/supportedwallets';

export const getSupportedWallets = async () => {
  const res = await fetch(API_ENDPOINT);
  return await res.json();
};

export const createErrorTemplate = () => {
  const tableBodyError = document.querySelector('#tableBodyError');
  const trElement = document.createElement('tr');
  const tdElement = document.createElement('td');
  tdElement.classList.add('text-red-500', 'p-5');
  tdElement.textContent = 'There was an error loading data.';

  trElement.appendChild(tdElement);
  tableBodyError.appendChild(trElement);
};

export const createLoadingTemplate = () => {
  const tableBodyLoading = document.querySelector('#tableBodyLoading');

  const createLoadingRow = () => {
    const trElement = document.createElement('tr');
    const tdElement = document.createElement('td');
    const displayNameWrapper = document.createElement('div');
    const displayName = document.createElement('div');
    const avatar = document.createElement('div');
    const tdClassLists = ['whitespace-nowrap', 'p-5', 'animate-pulse'];
    const displayNameWrapperClassLists = ['flex', 'items-center'];
    const avatarClassLists = [
      'h-11',
      'w-11',
      'rounded-full',
      'border',
      'bg-slate-200',
    ];
    const displayNameClassLists = [
      'ml-4',
      'h-4',
      'w-1/3',
      'bg-slate-200',
      'rounded-md',
    ];

    tdElement.classList.add(...tdClassLists);
    displayNameWrapper.classList.add(...displayNameWrapperClassLists);
    tdElement.appendChild(displayNameWrapper);
    avatar.classList.add(...avatarClassLists);
    displayName.classList.add(...displayNameClassLists);
    displayNameWrapper.appendChild(avatar);
    displayNameWrapper.appendChild(displayName);
    trElement.appendChild(tdElement);

    return trElement;
  };

  Array.from(Array(10).fill(null)).forEach((item) => {
    const loadingRow = createLoadingRow(item);
    tableBodyLoading.appendChild(loadingRow);
  });
};

export const toggleTableRows = () => {
  const parentRows = [...document.querySelectorAll('[data-child-key]')];

  if (!parentRows.length) {
    return;
  }

  parentRows.forEach((row) => {
    row.addEventListener('click', () => {
      const childKey = row.getAttribute('data-child-key');
      const childRow = document.querySelector(`[data-parent-key=${childKey}]`);

      if (!childRow) {
        return;
      }

      row.classList.toggle('bg-slate-100');
      row.classList.toggle('shadow-sm');
      childRow.classList.toggle('hidden');
    });
  });
};
