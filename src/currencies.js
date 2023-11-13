import {
  getSupportedWallets,
  createErrorTemplate,
  createLoadingTemplate,
  toggleTableRows,
} from './main.js';

const createCurrencyTableRow = (currency) => {
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
  const tdClassLists = ['whitespace-nowrap', 'py-[10px]', 'p-5', 'text-sm'];
  const displayNameWrapperClassLists = ['flex', 'items-center'];
  const avatarClassLists = ['h-11', 'w-11'];
  const displayNameClassLists = ['ml-4', 'font-medium'];

  tdElement.classList.add(...tdClassLists);
  displayNameWrapper.classList.add(...displayNameWrapperClassLists);
  tdElement.appendChild(displayNameWrapper);
  avatar.src = currency.image;
  avatar.classList.add(...avatarClassLists);

  displayName.classList.add(...displayNameClassLists);
  displayName.textContent = currency.code;
  displayNameWrapper.appendChild(avatar);
  displayNameWrapper.appendChild(displayName);

  trElement.classList.add(...trClassLists);
  trElement.setAttribute('data-child-key', currency.code);
  trElement.appendChild(tdElement);

  return trElement;
};

const createCurrencyWalletsTableRow = (wallets, currencyCode) => {
  const MAX_ITEMS_WITHOUT_COLUMN_SPLIT = 8;
  const trElement = document.createElement('tr');
  const tdElement = document.createElement('td');
  const walletsWrapper = document.createElement('div');
  const additionalWalletsWrapper = document.createElement('div');
  const trClassLists = ['hidden', 'transition-all'];
  const tdClassLists = [
    'whitespace-nowrap',
    'flex',
    'flex-col',
    'md:flex-row',
    'p-5',
    'gap-x-2',
    'text-sm',
  ];
  const walletsWrapperClassLists = ['flex', 'flex-1', 'flex-col'];
  trElement.classList.add(...trClassLists);
  tdElement.classList.add(...tdClassLists);
  walletsWrapper.classList.add(...walletsWrapperClassLists);
  additionalWalletsWrapper.classList.add(...walletsWrapperClassLists);

  if (wallets.length > MAX_ITEMS_WITHOUT_COLUMN_SPLIT) {
    wallets.forEach((wallet, index) => {
      if (index >= Math.round(wallets.length / 2)) { // 2 columns
        additionalWalletsWrapper.appendChild(createCurrencyWallet(wallet));
      } else {
        walletsWrapper.appendChild(createCurrencyWallet(wallet));
      }

      tdElement.appendChild(walletsWrapper);
      tdElement.appendChild(additionalWalletsWrapper);
      trElement.setAttribute('data-parent-key', currencyCode);
      trElement.appendChild(tdElement);
    });
  } else {
    wallets.forEach((wallet) => {
      walletsWrapper.appendChild(createCurrencyWallet(wallet));
    });

    tdElement.appendChild(walletsWrapper);
    trElement.setAttribute('data-parent-key', currencyCode);
    trElement.appendChild(tdElement);
  }

  return trElement;
};

const createCurrencyWallet = (wallet) => {
  const walletWrapper = document.createElement('div');
  const walletName = document.createElement('div');
  const walletImage = document.createElement('img');
  const walletImageClassLists = ['w-6', 'h-6'];
  const walletNameClassLists = ['ml-2'];
  const walletWrapperClassLists = ['flex', 'items-center', 'w-full', 'mb-2'];

  walletWrapper.classList.add(...walletWrapperClassLists);
  walletName.textContent = wallet.name;
  walletName.classList.add(...walletNameClassLists);
  walletImage.src = wallet.image;
  walletImage.classList.add(...walletImageClassLists);
  walletWrapper.appendChild(walletImage);
  walletWrapper.appendChild(walletName);

  return walletWrapper;
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

    let currencies = {};

    supportedWallets.forEach((supportedWallet) => {
      const walletCurrencies = supportedWallet['currencies'];
      return walletCurrencies.forEach((currency) => {
        const currencyCode = currency.code;

        if (!currencies[currencyCode]) {
          currencies[currencyCode] = {};
        }
        currencies[currencyCode]['code'] = currencyCode;
        currencies[currencyCode]['image'] = currency.image.replace('_m', '');
        if (!currencies[currencyCode].wallets) {
          currencies[currencyCode].wallets = [];
        }

        currencies[currencyCode].wallets.push({
          name: supportedWallet.displayName + ' (' + supportedWallet.key + ')',
          image: supportedWallet.image,
        });
      });
    });

    loadingTemplateEl.remove();
    errorTemplateEl.remove();

    const tableBody = document.querySelector('#tableBody');

    Object.values(currencies).forEach((currency) => {
      const currencyTableRow = createCurrencyTableRow(currency);
      const walletsTableRow = createCurrencyWalletsTableRow(
        currency.wallets,
        currency.code
      );
      tableBody.appendChild(currencyTableRow);
      tableBody.appendChild(walletsTableRow);
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