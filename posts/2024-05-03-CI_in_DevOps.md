---
layout: post
title: "DevOps中的CI"
subtitle: "DevOps，CI"
date: 2024-05-03
author: "Jiawei Bai"
header-img: "img/in-post/CICD/devops.png"
catalog: true
tags:
  - DevOps
  - CI/CD
---

# DevOps

## 软件开发过程&设计工具

<img src="/img/in-post/CICD/devops.png" alt="image-20240502231443039"/>

### CI/CD(持续集成和持续部署过程学习)

<img src="/img/in-post/CICD/image-20240502220404765.png" alt="image-20240502220404765" style="zoom: 50%;" />

### CODE 阶段—>服务器 01 安装 Gitlab（192.168.11.101）

利用 docker 环境：先安装 Docker 和 Docker-Compose

```shell
# 服务器01安装Gitlab
docker version
docker-compose version
systemctl stop firewalld # 关闭防火墙
mkdir docker && cd docker  # /usr/local/docker
mkdir gitlab_docker && cd gitlab_docker
touch docker-compose.yml
docker search gitlab # 查询gitlab的docker镜像
docker pull gitlab:latest # 下载
docker images # 确认下载的gitlab
nano docker-compose.yml # 编辑 如下

systemctl restart docker
docker-compose logs -f # 可通过浏览器访问192.168.11.101:8929查看gitlab
```

编辑 docker-compose.yml 文件，设置为 docker 启动就会让 gitlab 启动

```yml
version: '3.1'
services:
 gitlab:
  image: 'gitlab-image'  # 镜像名称
  container-name: gitlab # 容器名称
  restart: always    # 随着docker启动而启动
  environment:
   GITLAB_OMNIBUS_CONFIG:
    external_url 'http://192.168.11.101:8929' # 当前宿主机ip
    gitlab_rails['gitlab_shell_ssh_port']=2224
  ports:
   - '8989:8989'
   - '2224:2224'
  volumes:
   - './config:/etc/gitlab'
   - './logs:/var/log/gitlab'
   - './data:/var/opt/gitlab'
```

进入 docker 中的 gitlab 镜像编辑：

```shell
docker exec -it gitlab bash
cat /etc/gitlab/initial_root_password #找到gitlab密码，在浏览器中修改
# 在gitlab中创建新仓库，用于开发推送
```

### BUILD 阶段—>服务器 02 安装 Maven，JDK（192.168.11.102）

```shell
# Tip 修改虚拟机ip地址 超级模式下：
nano /etc/sysconfig/network-scripts/ifcfg-ens33
systemctl restart network
```

```shell
# 安装maven 安装jdk8
tar -zxvf maven -C /usr/local
tar -zxvf jdk8 -C /usr/local
cd maven && nano conf/settings.xml # 设置maven 的阿里云镜像
# maven默认使用jdk1.8版本
```

```yml
<profile>
<id>jdk8</id>
<activation>
<activeByDefault>true</activeByDefault>
<jdk>1.8</jdk>
</activation>
<properties>
<maven.compiler.source>1.8</maven.compiler.source>
<maven.compiler,target>1.8</maven.compiler.target>
<maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
</properties>
</profile>
```

### OPERATE 阶段—>服务器 02 安装 Docker

```shell
# 安装Docker
docker install # 各种方法
chmod +x docker-compose # 同时也要安装并赋予可执行
echo $PATH && mv docker-compose /usr/bin # 添加环境变量
systemctl start docker # 启动
systemctl enable docker # 开机自启动
docker version # 确定安装成功
docker-cmopose version
```

### INTEGRATE 阶段—>服务器 02 安装 Jenkins

<img src="/img/in-post/CICD/image-20240502225544686.png" alt="image-20240502225544686" style="zoom: 50%;" />

**CI 可以理解为：Jenkins 将代码拉取、构建、制作镜像交给测试人员测试。**
**持续集成：将代码持续的集成到主干上，并自动构建和测试**

**CD 可以理解为：通过 Jenkins 将打包好标签的发行版本代码拉取、构建、制作镜像交给运维人员部署。**
**持续交付：让经过持续集成的代码可以进行手动部署。**
**持续部署：让可以持续交付的代码随时随地的自动化部署**

```shell
# 安装Jenkins
docker pull jenkins/jenkins
cd /usr/local && mkdir docker
cd docker && mkdir jenkins_docker
touch docker-compose.yml # jenkins相关
docker-compose up -d
chmod -R 777 data # 给docker权限
docker-compose restart
docker logs -f jenkins # 获取密码
# 访问jenkins首页 192.168.11.102：8080并设置，下载插件
# Git parameter & Publish over SSH
```

编辑 docker-compose.yml

```yml
version: "3.1"
services:
  jenkins:
    image: "jenkins/jenkins:version-number" # 镜像名称
    container-name: jenkins # 容器名称
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - "./data/:/var/jenkins_home/" # 前面是宿主机，后面是镜像中项目和插件的位置
```

将 jdk 和 maven 移动到 jenkins 的 data 目录下

```shell
cd /usr/local/docker/jenkins_docker/data
mv /usr/local/jdk/ ./
mv /usr/local/maven/ ./
# 在容器中制定jdk和maven，可以在浏览器中全局设置中设置
```

在浏览器中全局设置中设置
<img src="/img/in-post/CICD/image-20240502231938967.png" alt="image-20240502231938967" style="zoom: 50%;" /><img src="/img/in-post/CICD/image-20240502232009886.png" alt="image-20240502232009886" style="zoom:50%;" />

在浏览器中系统设置中设置，发布地址

<img src="/img/in-post/CICD/image-20240502232213345.png" alt="image-20240502232213345" style="zoom:50%;" />

### CI 过程

#### 创建 git 仓库并推送代码

#### 通过 Freestyle Project 设置 Jenkins

<img src="/img/in-post/CICD/image-20240502234148371.png" alt="image-20240502234148371" style="zoom: 33%;" />

#### Build now

拉取到 jenkins

#### Configure

##### Build

##### Add build step: Invoke top-level Maven targets

<img src="/img/in-post/CICD/image-20240502234509415.png" alt="image-20240502234509415" style="zoom:50%;" />

##### Post-build-actions

<img src="/img/in-post/CICD/image-20240502234826480.png" alt="image-20240502234826480" style="zoom:50%;" /><img src="/img/in-post/CICD/image-20240502234714055.png" alt="image-20240502234714055" style="zoom: 33%;" />

##### 构建 docker 镜像

<img src="/img/in-post/CICD/image-20240502235646353.png" alt="image-20240502235646353" style="zoom:50%;" />

##### 构建 docker yml 文件

<img src="/img/in-post/CICD/image-20240503000622131.png" alt="image-20240503000622131" style="zoom:50%;" />

#### jenkins 拉取文件汇总

<img src="/img/in-post/CICD/image-20240502235929210.png" alt="image-20240502235929210" style="zoom: 67%;" />

#### 自动构建后执行

<img src="/img/in-post/CICD/image.jpeg" alt="image-20240503000356685" style="zoom:50%;" />

#### 查看效果

![image-20240503000701444](/img/in-post/CICD/image-20240503000701444.png)

### CD 过程

通过 Git parameter 根据 tag 进行拉取

<img src="/img/in-post/CICD/image-20240503001605031.png" alt="image-20240503001605031" style="zoom:50%;" />

根据 tag 进行检查

<img src="/img/in-post/CICD/image-20240503001643591.png" alt="image-20240503001643591" style="zoom:50%;" />

### SonarQube

### Harbor
