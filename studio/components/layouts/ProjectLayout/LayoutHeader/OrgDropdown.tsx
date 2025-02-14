import { useRouter } from 'next/router'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Button, Dropdown, IconPlus } from 'ui'

import { useFlag, useStore } from 'hooks'
import { IS_PLATFORM } from 'lib/constants'

const OrgDropdown = () => {
  const router = useRouter()
  const { app, ui } = useStore()

  const sortedOrganizations: any[] = app.organizations.list()
  const selectedOrganization: any = ui.selectedOrganization

  const orgCreationV2 = useFlag('orgcreationv2')

  return IS_PLATFORM ? (
    <Dropdown
      side="bottom"
      align="start"
      overlay={
        <>
          {sortedOrganizations
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((x) => {
              const slug = toJS(x.slug)

              return (
                <Dropdown.Item
                  key={slug}
                  onClick={() => {
                    if (!slug) {
                      // The user should not see this error as the page should
                      // be rerendered with the value of slug before they can click.
                      // It is just here in case they are the flash.
                      return ui.setNotification({
                        category: 'error',
                        message:
                          'Could not navigate to organization settings, please try again or contact support',
                      })
                    }

                    router.push({
                      pathname: `/org/[slug]/general`,
                      query: { slug },
                      hash: router.asPath.split('#')[1]?.toLowerCase(),
                    })
                  }}
                >
                  {x.name}
                </Dropdown.Item>
              )
            })}
          <Dropdown.Separator />
          <Dropdown.Item icon={<IconPlus size="tiny" />} onClick={() => router.push(`/new`)}>
            New organization
          </Dropdown.Item>
          {orgCreationV2 && (
            <Dropdown.Item
              icon={<IconPlus size="tiny" />}
              onClick={() => router.push(`/new-with-subscription`)}
            >
              New organization V2
            </Dropdown.Item>
          )}
        </>
      }
    >
      <Button asChild type="text" size="tiny">
        <span>{selectedOrganization.name}</span>
      </Button>
    </Dropdown>
  ) : (
    <Button asChild type="text" size="tiny">
      <span>{selectedOrganization.name}</span>
    </Button>
  )
}

export default observer(OrgDropdown)
