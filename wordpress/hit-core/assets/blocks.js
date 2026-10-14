(function (blocks, blockEditor, components, element, i18n) {
  'use strict';

  const el = element.createElement;
  const Fragment = element.Fragment;
  const InspectorControls = blockEditor.InspectorControls;
  const BlockControls = blockEditor.BlockControls;
  const useBlockProps = blockEditor.useBlockProps;
  const MediaUpload = blockEditor.MediaUpload;
  const MediaUploadCheck = blockEditor.MediaUploadCheck;
  const PanelBody = components.PanelBody;
  const TextControl = components.TextControl;
  const TextareaControl = components.TextareaControl;
  const ToggleControl = components.ToggleControl;
  const Button = components.Button;
  const ToolbarGroup = components.ToolbarGroup;
  const Notice = components.Notice;
  const __ = i18n.__;

  function documentFor(markup) {
    return new window.DOMParser().parseFromString('<div id="hit-edit-root">' + (markup || '') + '</div>', 'text/html');
  }

  function serialize(doc) {
    const root = doc.getElementById('hit-edit-root');
    return root ? root.innerHTML : '';
  }

  function records(markup, selector) {
    const doc = documentFor(markup);
    return Array.from(doc.querySelectorAll(selector)).map(function (node, index) {
      return { index: index, text: (node.textContent || '').trim(), html: node.innerHTML || '', node: node };
    });
  }

  function changeNode(markup, selector, index, callback) {
    const doc = documentFor(markup);
    const nodes = doc.querySelectorAll(selector);
    if (nodes[index]) callback(nodes[index], doc);
    return serialize(doc);
  }

  function shortLabel(value, fallback) {
    const clean = (value || '').replace(/\s+/g, ' ').trim();
    return clean ? (clean.length > 58 ? clean.slice(0, 58) + '…' : clean) : fallback;
  }

  blocks.registerBlockType('hit/section', {
    apiVersion: 3,
    title: __('HIT page section', 'hit-core'),
    description: __('An editable section from the HIT website.', 'hit-core'),
    icon: 'layout',
    category: 'hit',
    attributes: {
      markup: { type: 'string', default: '' },
      label: { type: 'string', default: 'Page section' },
      hidden: { type: 'boolean', default: false }
    },
    supports: { html: false, reusable: true },

    edit: function (props) {
      const attrs = props.attributes;
      const set = props.setAttributes;
      const blockProps = useBlockProps({
        className: 'hit-section-editor' + (attrs.hidden ? ' is-hidden' : '')
      });
      const textItems = records(attrs.markup, 'h1,h2,h3,h4,h5,h6,p').filter(function (item) {
        return !item.node.querySelector('a,button,input,select,textarea');
      });
      const links = records(attrs.markup, 'a');
      const images = records(attrs.markup, 'img');

      function updateFilteredText(filteredIndex, value) {
        const target = textItems[filteredIndex];
        if (!target) return;
        set({ markup: changeNode(attrs.markup, 'h1,h2,h3,h4,h5,h6,p', target.index, function (node) {
          node.textContent = value;
        }) });
      }

      function updateLink(index, property, value) {
        set({ markup: changeNode(attrs.markup, 'a', index, function (node) {
          if (property === 'href') node.setAttribute('href', value);
          else {
            const decorative = Array.from(node.querySelectorAll('[aria-hidden="true"],.btn__arrow')).map(function (item) { return item.outerHTML; }).join('');
            node.textContent = value;
            if (decorative) node.insertAdjacentHTML('beforeend', decorative);
          }
        }) });
      }

      function updateImage(index, media) {
        set({ markup: changeNode(attrs.markup, 'img', index, function (node) {
          node.setAttribute('src', media.url);
          node.removeAttribute('srcset');
          node.removeAttribute('sizes');
          if (media.alt) node.setAttribute('alt', media.alt);
          const picture = node.closest('picture');
          if (picture) Array.from(picture.querySelectorAll('source')).forEach(function (source) { source.setAttribute('srcset', media.url); });
        }) });
      }

      const inspector = el(InspectorControls, {},
        el(PanelBody, { title: __('Section settings', 'hit-core'), initialOpen: true },
          el(TextControl, {
            label: __('Section name in editor', 'hit-core'),
            value: attrs.label,
            onChange: function (value) { set({ label: value }); }
          }),
          el(ToggleControl, {
            label: __('Hide this section from the website', 'hit-core'),
            checked: !!attrs.hidden,
            onChange: function (value) { set({ hidden: value }); }
          })
        ),
        el(PanelBody, { title: __('Text', 'hit-core'), initialOpen: true },
          textItems.length ? textItems.map(function (item, index) {
            return el(TextareaControl, {
              key: 'text-' + index,
              label: shortLabel(item.text, __('Text', 'hit-core')),
              value: item.text,
              rows: item.text.length > 110 ? 4 : 2,
              onChange: function (value) { updateFilteredText(index, value); }
            });
          }) : el('p', {}, __('No standalone text fields were found in this section.', 'hit-core'))
        ),
        el(PanelBody, { title: __('Buttons and links', 'hit-core'), initialOpen: false },
          links.length ? links.map(function (item, index) {
            return el('div', { className: 'hit-block-field-group', key: 'link-' + index },
              el(TextControl, {
                label: __('Link text', 'hit-core'),
                value: item.text,
                onChange: function (value) { updateLink(index, 'text', value); }
              }),
              el(TextControl, {
                label: __('Link address', 'hit-core'),
                value: item.node.getAttribute('href') || '',
                onChange: function (value) { updateLink(index, 'href', value); }
              })
            );
          }) : el('p', {}, __('No links were found in this section.', 'hit-core'))
        ),
        el(PanelBody, { title: __('Images', 'hit-core'), initialOpen: false },
          images.length ? images.map(function (item, index) {
            const src = item.node.getAttribute('src') || '';
            return el('div', { className: 'hit-block-image-control', key: 'image-' + index },
              src ? el('img', { src: src, alt: '', className: 'hit-block-image-thumb' }) : null,
              el(MediaUploadCheck, {}, el(MediaUpload, {
                allowedTypes: ['image'],
                onSelect: function (media) { updateImage(index, media); },
                render: function (mediaProps) {
                  return el(Button, { variant: 'secondary', onClick: mediaProps.open }, __('Replace image', 'hit-core'));
                }
              })),
              el(TextControl, {
                label: __('Alternative text', 'hit-core'),
                value: item.node.getAttribute('alt') || '',
                onChange: function (value) {
                  set({ markup: changeNode(attrs.markup, 'img', index, function (node) { node.setAttribute('alt', value); }) });
                }
              })
            );
          }) : el('p', {}, __('No images were found in this section.', 'hit-core'))
        ),
        el(PanelBody, { title: __('Advanced section HTML', 'hit-core'), initialOpen: false },
          el(Notice, { status: 'warning', isDismissible: false }, __('Use this only for layout-level changes. Text and images are easier to edit above.', 'hit-core')),
          el(TextareaControl, {
            label: __('Section HTML', 'hit-core'),
            value: attrs.markup,
            rows: 12,
            onChange: function (value) { set({ markup: value }); }
          })
        )
      );

      return el(Fragment, {},
        inspector,
        el(BlockControls, {}, el(ToolbarGroup, {},
          el(ToggleControl, {
            label: __('Hidden', 'hit-core'),
            checked: !!attrs.hidden,
            onChange: function (value) { set({ hidden: value }); }
          })
        )),
        el('div', blockProps,
          el('div', { className: 'hit-section-editor__bar' },
            el('strong', {}, attrs.label || __('Page section', 'hit-core')),
            el('span', {}, attrs.hidden ? __('Hidden from website', 'hit-core') : __('Select this section, then edit its content in the sidebar.', 'hit-core'))
          ),
          el('div', {
            className: 'hit-section-editor__preview',
            onClick: function (event) {
              if (event.target.closest('a,button')) event.preventDefault();
            },
            dangerouslySetInnerHTML: { __html: attrs.markup }
          })
        )
      );
    },
    save: function () { return null; }
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);

