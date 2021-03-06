.PHONY:

REPO := "capptions/messages"
PKG_NAME=$(shell basename `pwd`)

docker:
	docker-compose -f docker-compose.yaml build messages

docker_login:
	docker login -u "$(DOCKER_USERNAME)" -p "$(DOCKER_PASSWORD)"

docker_upload: docker_login
	docker-compose -f docker-compose.yaml push messages
	docker tag $(REPO):latest $(REPO):$(TRAVIS_BRANCH)-$(TRAVIS_BUILD_NUMBER)
	docker push $(REPO):$(TRAVIS_BRANCH)-$(TRAVIS_BUILD_NUMBER)
	docker tag $(REPO):latest $(REPO):$(TRAVIS_BRANCH)-latest
	docker push $(REPO):$(TRAVIS_BRANCH)-latest

