import { getSupportedWallets, createErrorTemplate, createLoadingTemplate, toggleTableRows } from './main.js';

const createWalletTableRow = (supportedWallet) => {
  const trElement = document.createElement('tr');
  const tdElement = document.createElement('td');
  const displayNameWrapper = document.createElement('div');
  const displayName = document.createElement('div');
  const avatar = document.createElement('img');

  const trClassLists = [
    'hover:bg-slate-200',
    'cursor-pointer',
    'transition-all',
  ];
  const tdClassLists = ['whitespace-nowrap', 'p-5', 'text-sm'];
  const displayNameWrapperClassLists = ['flex', 'items-center'];
  const avatarClassLists = ['h-11', 'w-11'];
  const displayNameClassLists = ['ml-4', 'font-medium'];

  tdElement.classList.add(...tdClassLists);
  displayNameWrapper.classList.add(...displayNameWrapperClassLists);
  tdElement.appendChild(displayNameWrapper);
  avatar.src = supportedWallet.image;
  avatar.classList.add(...avatarClassLists);
  displayName.classList.add(...displayNameClassLists);
  displayName.textContent = `${supportedWallet.displayName} (${supportedWallet.key})`;
  displayNameWrapper.appendChild(avatar);
  displayNameWrapper.appendChild(displayName);
  trElement.classList.add(...trClassLists);
  trElement.setAttribute('data-child-key', supportedWallet.key);
  trElement.appendChild(tdElement);

  return trElement;
};

const createWalletCurrenciesTableRow = (walletCurrencies, walletKey) => {
  const trElement = document.createElement('tr');
  const tdElement = document.createElement('td');
  const currenciesWrapper = document.createElement('div');
  const trClassLists = ['hidden', 'transition-all'];
  const tdClassLists = ['whitespace-nowrap', 'p-5', 'text-sm'];
  const currenciesWrapperClassLists = ['flex', 'flex-wrap', '-mx-4'];
  trElement.classList.add(...trClassLists);
  tdElement.classList.add(...tdClassLists);
  currenciesWrapper.classList.add(...currenciesWrapperClassLists);

  walletCurrencies.forEach((currency) => {
    const walletCurrencyElement = createWalletCurrency(currency);
    currenciesWrapper.appendChild(walletCurrencyElement);
  });

  tdElement.appendChild(currenciesWrapper);
  trElement.setAttribute('data-parent-key', walletKey);
  trElement.appendChild(tdElement);

  return trElement;
};

const createWalletCurrency = (currency) => {
  const currencyWrapper = document.createElement('div');
  const currencyCode = document.createElement('div');
  const currencyImage = document.createElement('img');

  const currencyImageClassLists = ['w-6', 'h-6'];
  const currencyCodeClassLists = ['ml-2'];
  const currencyWrapperClassLists = [
    'px-4',
    'flex',
    'items-center',
    'w-1/2',
    'sm:w-1/4',
    'md:w-1/5',
    'mb-2',
  ];

  currencyWrapper.classList.add(...currencyWrapperClassLists);
  currencyCode.textContent = currency.code;
  currencyCode.classList.add(...currencyCodeClassLists);
  currencyImage.src = currency.image.replace('_m', '');
  currencyImage.classList.add(...currencyImageClassLists);
  currencyWrapper.appendChild(currencyImage);
  currencyWrapper.appendChild(currencyCode);

  return currencyWrapper;
};


const prepareTable = async () => {
  const loadingTemplateEl = document.querySelector('#tableBodyLoading');
  const errorTemplateEl = document.querySelector('#tableBodyError');
  const bitPayWalletDisplayName = 'BitPay';

  createLoadingTemplate();

  try {
    const { data } = await getSupportedWallets();
    const bitpayWallets = data.filter(
      (wallet) => wallet.displayName === bitPayWalletDisplayName
    );

    let supportedWallets = data.filter(
      (supportedWallet) =>
        'displayName' in supportedWallet &&
        supportedWallet.displayName !== bitPayWalletDisplayName
    );
    supportedWallets.sort((a, b) =>
      a.displayName.toLowerCase() > b.displayName.toLowerCase() ? 1 : -1
    );
    supportedWallets = [...bitpayWallets, ...supportedWallets];

    loadingTemplateEl.remove();
    errorTemplateEl.remove();

    const tableBody = document.querySelector('#tableBody');
    supportedWallets.forEach((supportedWallet) => {
      const walletCurrencies = supportedWallet.currencies.sort((a, b) =>
        a.code.toLowerCase() > b.code.toLowerCase() ? 1 : -1
      );
      const walletTableRow = createWalletTableRow(supportedWallet);
      const currenciesTableRow = createWalletCurrenciesTableRow(
        walletCurrencies,
        supportedWallet.key
      );
      tableBody.appendChild(walletTableRow);
      tableBody.appendChild(currenciesTableRow);
    });

    toggleTableRows();
  } catch (e) {
    loadingTemplateEl.remove();
    createErrorTemplate();
  }
};

window.addEventListener('DOMContentLoaded', async () => {
  await prepareTable();
});