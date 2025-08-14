import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const IyzicoForm = ({ checkoutFormContent }) => {
  const formContainerRef = useRef(null);

  useEffect(() => {
    const formContainer = formContainerRef.current;
    if (checkoutFormContent && formContainer) {
      formContainer.innerHTML = '';

      const wrapper = document.createElement('div');
      wrapper.innerHTML = checkoutFormContent;
      formContainer.appendChild(wrapper);

      const scripts = Array.from(wrapper.getElementsByTagName('script'));
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        document.body.appendChild(newScript).onload = () => {
          // Iyzico script'i yüklendikten sonra iframe'i bulup stil ekleyebiliriz
          // Ancak genellikle Iyzico bunu kendi yönetir.
          // Temel sorun genellikle container'ın boyutlandırmasıdır.
        };
      });
    }

    return () => {
      // Iyzico ile ilgili olabilecek scriptleri temizle
      const iyzicoScripts = document.querySelectorAll('script[src*="iyzico"], script[id*="iyzico"]');
      iyzicoScripts.forEach(script => {
        if (document.body.contains(script)) {
            document.body.removeChild(script);
        }
      });
    };
  }, [checkoutFormContent]);

  /**
   * Iyzico formunu çevreleyen container için stiller.
   * - position: 'relative': Iyzico'nun formu absolute position ile eklemesi durumunda,
   * bu container'ın sınırları içinde kalmasını sağlar. Bu en önemli kuraldır.
   * - minHeight: '500px': Iframe yüklenirken container'ın yüksekliğinin sıfır olup
   * sayfa düzenini bozmasını engeller. Formun standart yüksekliğine göre ayarlanabilir.
   * - width: '100%': Container'ın, içinde bulunduğu `CardContent` bileşeninin tüm genişliğini
   * kaplamasını sağlar.
   */
  const containerStyle = {
    position: 'relative',
    minHeight: '500px',
    width: '100%',
    border: '1px solid #e2e8f0', // İsteğe bağlı: formun alanını görmek için kenarlık
    borderRadius: '8px',      // İsteğe bağlı: kenarları yuvarlatmak için
    padding: '10px',          // İsteğe bağlı: iç boşluk
    overflow: 'hidden'        // İsteğe bağlı: taşmaları gizlemek için
  };

  return (
    <div
      ref={formContainerRef}
      id="iyzipay-checkout-form" // ID'yi daha genel hale getirdik
      style={containerStyle}
    />
  );
};

IyzicoForm.propTypes = {
  checkoutFormContent: PropTypes.string,
};

export default IyzicoForm;